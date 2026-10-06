variable "kubeconfig_path" {
  type        = string
  description = "Path to the kubeconfig file"
  default     = "~/.kube/config"
}

variable "namespace" {
  type        = string
  description = "Kubernetes namespace for Bhooraksha services"
  default     = "bhooraksha"
}

variable "helm_repo" {
  type        = string
  description = "Path or URL to the Helm chart repository"
  default     = "../helm/bhooraksha"
}

variable "chart_version" {
  type        = string
  description = "Bhooraksha Helm Chart Version"
  default     = "1.0.0"
}

variable "environment" {
  type        = string
  description = "Target deployment environment (development, staging, production)"
  default     = "production"
}
