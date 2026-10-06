terraform {
  required_version = ">= 1.5.0"
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.25.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.12.0"
    }
  }
}

provider "kubernetes" {
  config_path = var.kubeconfig_path
}

provider "helm" {
  kubernetes {
    config_path = var.kubeconfig_path
  }
}

resource "kubernetes_namespace" "bhooraksha" {
  metadata {
    name = var.namespace
    labels = {
      "app.kubernetes.io/name"       = "bhooraksha"
      "app.kubernetes.io/managed-by" = "terraform"
    }
  }
}

resource "helm_release" "bhooraksha" {
  name       = "bhooraksha"
  repository = var.helm_repo
  chart      = "bhooraksha"
  namespace  = kubernetes_namespace.bhooraksha.metadata[0].name
  version    = var.chart_version

  values = [
    file("${path.module}/../helm/bhooraksha/values.yaml")
  ]
}
