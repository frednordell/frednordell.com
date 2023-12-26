variable "backblazeb2_access_key" {
    sensitive = true
}
variable "backblazeb2_secret_key" {
    sensitive = true
}

terraform {
  backend "s3" {
    skip_credentials_validation = true
    skip_metadata_api_check     = true
    endpoint                    = "s3.us-east-005.backblazeb2.com"
    region                      = "us-east-1" # meaningless, but the provider needs it. It can be any string
    bucket                      = "fnor-tf-state"
    key                         = "terraform.tfstate"
  }
}