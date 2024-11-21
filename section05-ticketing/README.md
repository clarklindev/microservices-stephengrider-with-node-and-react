# how to start this project: section05-ticketing

### TODO:

1. start docker desktop (ensure docker + kubernetes started)

- NOTE: docker logged-in

2. ensure correct kubernetes context selected
   - right click docker-desktop app, select kubernetes context

- NOTE: gcloud project has already been created
- NOTE: gcloud kubernetes context already created (see readme)
- NOTE: you already have a gcloud project id (configured in infra/k8s/ yaml files)

3. kubernetes engine -> clusters -> switch to standard -> config -> create

- config: zonal -> asia-east1-a (pick whats closest)
- node pools -> nodes -> machine family (N1) -> type: shared core (g1-small) -> bootdisk size (83gb)

4. login gcloud

```
gcloud container clusters get-credentials ticketing-dev
```

5. ensure cluster-admin permissions

```
kubectl create clusterrolebinding cluster-admin-binding --clusterrole cluster-admin --user $(gcloud config get-value account)

```

6. create ingres-controller/ load balancer (use code)

- with code:

```cmd
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.0-beta.0/deploy/static/provider/cloud/deploy.yaml
```

- NOTE: once the kubernetes load balancer is created, you need to get the ip. this ip must be put in the host file (windows/system32/drivers/etc/host):
  - eg. 134.44.32.54 ticketing.dev (which means if you visit `ticketing.dev`, direct traffic to the load balancer)
- NOTE: deleting is `kubectl delete -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.0-beta.0/deploy/static/provider/cloud/deploy.yaml`

7. start skaffold

- section05-ticketing/

```cmd
skaffold dev
```

8.  ensure loadbalancer created

```cmd
gcloud console -> view all products -> networking -> network services -> load balancer
```

#### TROUBLESHOOT

- NOTE: if you delete the load balancer (but no the cluster), running the `create ingres-controller/ load balancer` command doesnt re-create the loadbalancer as the controller still exists.
- FIX: by deleting and starting again

9. google cloud dashboard

- [google cloud dashboard](https://console.cloud.google.com/apis/dashboard?pli=1)

10. get load balancer ip

- [check load balancer](https://console.cloud.google.com/net-services/loadbalancing/)

11. paste in host (save as administrator)

- redirect url ticketing.dev to loadbalancer ip

- c:\Windows\System32\drivers\etc\hosts

```
34.80.20.175 ticketing.dev
```

12. test by visiting:

```
https://ticketing.dev/api/users/currentuser
```

NOTE: SSL certificate error `Your connection is not private`
FIX: click on browser page and type 'thisisunsafe' -> hi there

13. shutting down

- from gcloud console -> shutdown kubernetes cluster (this costs money to keep running)

14. creating and accessing secrets for pods (JWT signing key)

- NOTE: everytime you start up kubernetes kluster, if you used imperative approach for creating secrets, you have to initialize the create secret commands again in the commandline.

- see notes 179. creating and accessing secrets

```
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf
```
