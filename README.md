# Task Manager App

A small but realistic containerized application for DevOps/Kubernetes practice.

## Stack
- Frontend: HTML/CSS/JavaScript
- Backend: Node.js + Express
- Database: PostgreSQL
- Container: Docker
- Local multi-container test: Docker Compose
- Kubernetes deployment: Helm
- Kubernetes database storage: PersistentVolumeClaim

## Application features
- View tasks
- Add tasks
- Mark tasks complete
- Delete tasks
- PostgreSQL persistence
- `/health` endpoint

## 1. Test with Docker Compose

```bash
docker compose up --build
```

Open:

http://localhost:8080

Health check:

http://localhost:8080/health

Stop:

```bash
docker compose down
```

To remove the database volume too:

```bash
docker compose down -v
```

## 2. Test with Kubernetes + Helm

Build the application image:

```bash
docker build -t task-manager:v1 ./backend
```

For Minikube, make the image available to the cluster:

```bash
minikube image load task-manager:v1
```

Install:

```bash
helm install task-manager ./helm/task-manager
```

Check:

```bash
kubectl get pods
kubectl get svc
```

Get the URL on Minikube:

```bash
minikube service task-manager --url
```

Open the returned URL in a browser.

Health:

```bash
curl <URL>/health
```

Upgrade example:

```bash
helm upgrade task-manager ./helm/task-manager --set replicaCount=2
```

Rollback:

```bash
helm history task-manager
helm rollback task-manager 1
```

## Cleanup

```bash
helm uninstall task-manager
```

Then, if desired:

```bash
kubectl delete pvc -l app.kubernetes.io/instance=task-manager
```

## Important production note

This project intentionally runs PostgreSQL inside Kubernetes so you can learn Pods, Services, PVCs and Helm. In many production environments, teams use a managed database such as Amazon RDS instead of running PostgreSQL themselves.
