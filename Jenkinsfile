pipeline {
  agent any
  stages {
    stage('Build') {
      agent {
        docker {
          image 'node:14-buster'
        }
      }
      steps {
        sh 'yarn install --frozen-lockfile'
        sh 'yarn run build'
        sh 'tar -cvf builtSources.tar ./dist/'
        stash(name: 'dist-files', includes: 'builtSources.tar', useDefaultExcludes: true)
      }
    }

    stage('Publish') {
      environment {
        registryCredential = 'docker-repo-jenkinsci'
      }
      steps {
        unstash 'dist-files'
        sh 'tar -xvf builtSources.tar'
        script {
          commitId = sh(returnStdout: true, script: 'git rev-parse --short HEAD')
          def appimage = docker.build imageName + ":" + commitId.trim()
          docker.withRegistry( 'https://docker.example.com', registryCredential ) {
            appimage.push()
            if (env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'release') {
              appimage.push('latest')
              if (env.BRANCH_NAME == 'release') {
                appimage.push("release-" + "${COMMIT_SHA}")
              }
            }
          }
        }
      }
    }

    stage('Deploy Dev') {
      when {
        branch 'main'
      }
      environment {
        registryCredential = 'docker-repo-jenkinsci'
      }
      steps {
        script{
          commitId = sh(returnStdout: true, script: 'git rev-parse --short HEAD')
          commitId = commitId.trim()
          withKubeConfig(credentialsId: 'kubeconfig') {
            withCredentials(bindings: [usernamePassword(credentialsId: registryCredential, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
              sh 'kubectl delete secret regcred --namespace=example-dev --ignore-not-found'
              sh 'kubectl create secret docker-registry regcred --namespace=example-dev --docker-server=https://docker.example.com --docker-username=$DOCKER_USERNAME --docker-password=$DOCKER_PASSWORD --docker-email=email@example.com'
            }
            sh "helm upgrade --set image.tag=${commitId} --install --wait dev-example-service ./chart --namespace example-dev"
          }
        }
      }
    }

    stage('Deploy Prod') {
      when {
        branch 'release'
      }
      environment {
        registryCredential = 'docker-repo-jenkinsci'
      }
      steps {
        script {
          commitId = sh(returnStdout: true, script: 'git rev-parse --short HEAD')
          commitId = commitId.trim()
          echo commitId
          withKubeConfig(credentialsId: 'kubeconfig') {
            withCredentials(bindings: [usernamePassword(credentialsId: registryCredential, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                sh 'kubectl delete secret regcred --namespace=example-prod --ignore-not-found'
                sh 'kubectl create secret docker-registry regcred --namespace=example-prod --docker-server=https://docker.example.com --docker-username=$DOCKER_USERNAME --docker-password=$DOCKER_PASSWORD --docker-email=email@example.com'
            }
            sh "helm upgrade --set image.tag=${commitId} --install --wait prod-example-service ./chart --namespace example-prod"
          }
        }
      }
    }
  }
  environment {
    imageName = 'example-service'
  }
}
