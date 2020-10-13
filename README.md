# Docker-compose web project
> Simple website with node express as web server and postgres as database

![](./Showcase/Showcase_1.png)

![](./Showcase/Showcase_2.png)


## Installation

OS X & Linux:

* First you need to install [docker and docker-compose](https://docs.docker.com/compose/install/).
* After install you should clone project from github
* Create the new network, called 'dev'
```sh
docker network create dev
```
* Start docker-compose
```sh
docker-compose up --build
```