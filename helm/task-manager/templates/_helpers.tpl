{{- define "task-manager.name" -}}
{{- .Chart.Name -}}
{{- end }}

{{- define "task-manager.fullname" -}}
{{- printf "%s-%s" .Release.Name .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- end }}
