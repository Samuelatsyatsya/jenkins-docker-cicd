# Minimal WAF - No CloudWatch Costs
resource "aws_wafv2_web_acl" "alb" {
  name        = "${var.project_name}-waf-${var.environment}"
  description = "WAF for ${var.project_name} - Blocks attacks, no CloudWatch"
  scope       = "REGIONAL"
  
  default_action {
    allow {}  # Allow normal traffic
  }

  # 1. RATE LIMITING - Stops DDoS
  rule {
    name     = "RateLimit"
    priority = 1

    action {
      block {}  # Block if exceeds limit
    }

    statement {
      rate_based_statement {
        limit              = var.waf_rate_limit
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = false  # NO CloudWatch costs
      metric_name                = "RateLimit"
      sampled_requests_enabled   = false  # NO sampling costs
    }
  }

  # 2. SQL INJECTION PROTECTION - AWS Managed (cheap)
  rule {
    name     = "SQLInjection"
    priority = 2

    override_action {
      none {}  # Count mode (doesn't block, just counts)
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesSQLiRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = false
      metric_name                = "SQLInjection"
      sampled_requests_enabled   = false
    }
  }

  # 3. COMMON ATTACKS - AWS Managed
  rule {
    name     = "CommonAttacks"
    priority = 3

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = false
      metric_name                = "CommonAttacks"
      sampled_requests_enabled   = false
    }
  }

  # WAF ACL-level visibility - ALL DISABLED
  visibility_config {
    cloudwatch_metrics_enabled = false  # CRITICAL: No CloudWatch
    metric_name                = "${var.project_name}-waf"
    sampled_requests_enabled   = false  # CRITICAL: No request sampling
  }

  tags = {
    Name        = "${var.project_name}-waf-${var.environment}"
    Environment = var.environment
    ManagedBy   = "Terraform"
    CostOptimized = "true"
    CloudWatch   = "disabled"
  }
}

# Associate WAF with ALB (required)
resource "aws_wafv2_web_acl_association" "alb" {
  resource_arn = aws_lb.app.arn
  web_acl_arn  = aws_wafv2_web_acl.alb.arn
}

# Optional: IP Set for known bad IPs (manual blocking)
resource "aws_wafv2_ip_set" "manual_block" {
  count = length(var.blocked_ips) > 0 ? 1 : 0
  
  name               = "${var.project_name}-manual-block-${var.environment}"
  description        = "Manually blocked IPs"
  scope              = "REGIONAL"
  ip_address_version = "IPV4"
  addresses          = var.blocked_ips
  
  tags = {
    Name = "${var.project_name}-manual-block"
  }
}

# Optional: Block rule using IP Set
resource "aws_wafv2_web_acl" "alb_with_ip_block" {
  # This is an alternative if you want IP blocking
  # Using count to conditionally create with IP blocking
  count = length(var.blocked_ips) > 0 ? 1 : 0
  
  name        = "${var.project_name}-waf-ipblock-${var.environment}"
  scope       = "REGIONAL"
  
  default_action {
    allow {}
  }

  # IP Block Rule (highest priority)
  rule {
    name     = "ManualIPBlock"
    priority = 0  # Highest priority

    action {
      block {}
    }

    statement {
      ip_set_reference_statement {
        arn = aws_wafv2_ip_set.manual_block[0].arn
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = false
      metric_name                = "ManualIPBlock"
      sampled_requests_enabled   = false
    }
  }

  # ... rest of rules same as above (rate limit, SQLi, etc.)
  # but with priorities adjusted (1, 2, 3...)

  visibility_config {
    cloudwatch_metrics_enabled = false
    metric_name                = "${var.project_name}-waf-ipblock"
    sampled_requests_enabled   = false
  }
}