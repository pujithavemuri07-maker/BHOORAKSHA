output "namespace" {
  value       = kubernetes_namespace.bhooraksha.metadata[0].name
  description = "Created Kubernetes Namespace"
}

output "helm_release_status" {
  value       = helm_release.bhooraksha.status
  description = "Helm release deployment status"
}

output "chart_version" {
  value       = helm_release.bhooraksha.version
  description = "Installed Helm chart version"
}
