node {
     stage('Clone repository') {
         checkout scm
     }
     stage('Build image') {
         app = docker.build("ap-seoul-1.ocir.io/cnqphqevfxnp/video-storage-jenkins")
     }
     stage('Push image') {
         docker.withRegistry('https://ap-seoul-1.ocir.io', 'ocir') {
             app.push("${env.BUILD_NUMBER}")
             app.push("latest")
         }
     }
}