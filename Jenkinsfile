pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }

  triggers {
    cron('''TZ=Asia/Colombo
30 16,21 * * *''')
  }

  parameters {
    choice(
      name: 'PIPELINE_MODE',
      choices: ['auto', 'code-review', 'main-smoke', 'scheduled-regression', 'cleanup-code-review-tags'],
      description: 'auto detects pull-request and branch builds; choose a mode to run manually.'
    )
  }

  environment {
    CI = 'true'
    PLAYWRIGHT_JUNIT_OUTPUT_NAME = 'results.xml'
    PLAYWRIGHT_JUNIT_OUTPUT_DIR = 'test-results'
  }

  stages {
    stage('Resolve mode') {
      steps {
        script {
          env.RESOLVED_PIPELINE_MODE = resolvePipelineMode()
          echo "Pipeline mode: ${env.RESOLVED_PIPELINE_MODE}"
        }
      }
    }

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install dependencies') {
      when {
        expression { env.RESOLVED_PIPELINE_MODE in ['code-review', 'main-smoke', 'scheduled-regression'] }
      }
      steps {
        script {
          runCommand('npm install')
          installPlaywrightChromium()
        }
      }
    }

    stage('Code review tests') {
      when {
        expression { env.RESOLVED_PIPELINE_MODE == 'code-review' }
      }
      environment {
        RUN_MUTATING_TESTS = 'true'
      }
      steps {
        script {
          if (hasCodeReviewTests()) {
            runCommand('npx playwright test --project=chromium --grep "@codeReview"')
          } else {
            echo 'No @codeReview tests found. Skipping code review execution.'
          }
        }
      }
      post {
        always {
          publishArtifacts('code-review-report')
        }
      }
    }

    stage('Main smoke tests') {
      when {
        expression { env.RESOLVED_PIPELINE_MODE == 'main-smoke' }
      }
      steps {
        script {
          runCommand('npx playwright test --project=chromium --grep "@smoke"')
        }
      }
      post {
        always {
          publishArtifacts('main-smoke-report')
        }
      }
    }

    stage('Scheduled regression tests') {
      when {
        expression { env.RESOLVED_PIPELINE_MODE == 'scheduled-regression' }
      }
      environment {
        RUN_MUTATING_TESTS = 'true'
      }
      steps {
        script {
          runCommand('npx playwright test --project=chromium --grep "@regression"')
        }
      }
      post {
        always {
          publishArtifacts('scheduled-regression-report')
        }
      }
    }

    stage('Cleanup code review tags') {
      when {
        expression { env.RESOLVED_PIPELINE_MODE == 'cleanup-code-review-tags' }
      }
      steps {
        script {
          if (lastCommitMessage().trim() == 'remove code review tags after merge') {
            echo 'Cleanup commit detected. Skipping to avoid a loop.'
            return
          }

          runCommand('python scripts/cleanup-code-review-tags.py')

          if (hasGitChanges()) {
            withCredentials([usernamePassword(credentialsId: 'jenkins-github-push', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]) {
              script {
                configureGitIdentity()
                if (isUnix()) {
                  sh 'git add tests scripts/cleanup-code-review-tags.py'
                  sh 'git commit -m "remove code review tags after merge"'
                  sh '''
                    git remote set-url origin https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/ravindupersonalrepo/playwright_CI_CD_DD.git
                    git push origin HEAD:develop
                  '''
                } else {
                  bat 'git add tests scripts/cleanup-code-review-tags.py'
                  bat 'git commit -m "remove code review tags after merge"'
                  bat 'git remote set-url origin https://%GIT_USERNAME%:%GIT_PASSWORD%@github.com/ravindupersonalrepo/playwright_CI_CD_DD.git'
                  bat 'git push origin HEAD:develop'
                }
              }
            }
          } else {
            echo 'No @codeReview tags found. Nothing to commit.'
          }
        }
      }
    }
  }
}

def resolvePipelineMode() {
  if (params.PIPELINE_MODE && params.PIPELINE_MODE != 'auto') {
    return params.PIPELINE_MODE
  }

  if (env.CHANGE_ID && env.CHANGE_TARGET == 'develop') {
    return 'code-review'
  }

  if (env.CHANGE_ID && env.CHANGE_TARGET == 'main') {
    return 'main-smoke'
  }

  def causes = currentBuild.rawBuild.getCauses()*.class*.simpleName.flatten()
  if (causes.contains('TimerTriggerCause')) {
    return 'scheduled-regression'
  }

  if (!env.CHANGE_ID && env.BRANCH_NAME == 'develop') {
    return 'cleanup-code-review-tags'
  }

  return 'scheduled-regression'
}

def runCommand(String command) {
  if (isUnix()) {
    sh command
  } else {
    bat command
  }
}

def installPlaywrightChromium() {
  if (isUnix()) {
    sh 'npx playwright install --with-deps chromium'
  } else {
    bat 'npx playwright install chromium'
  }
}

def hasCodeReviewTests() {
  if (isUnix()) {
    return sh(script: "grep -R '@codeReview' tests >/dev/null 2>&1", returnStatus: true) == 0
  }

  return powershell(returnStatus: true, script: "if (Get-ChildItem -Recurse tests\\*.spec.ts | Select-String -Pattern '@codeReview' -Quiet) { exit 0 } else { exit 1 }") == 0
}

def hasGitChanges() {
  def status = isUnix()
    ? sh(script: 'git diff --quiet', returnStatus: true)
    : bat(script: '@git diff --quiet', returnStatus: true)
  return status != 0
}

def lastCommitMessage() {
  return isUnix()
    ? sh(script: 'git log -1 --pretty=%B', returnStdout: true).trim()
    : bat(script: '@git log -1 --pretty=%B', returnStdout: true).trim()
}

def configureGitIdentity() {
  if (isUnix()) {
    sh 'git config user.name "jenkins"'
    sh 'git config user.email "jenkins@local"'
  } else {
    bat 'git config user.name "jenkins"'
    bat 'git config user.email "jenkins@local"'
  }
}

def publishArtifacts(String artifactName) {
  junit allowEmptyResults: true, testResults: 'test-results/results.xml'
  archiveArtifacts allowEmptyArchive: true, artifacts: 'monocart-report/**,playwright-report/**,test-results/**', fingerprint: true, onlyIfSuccessful: false
  echo "Archived artifacts for ${artifactName}"
}
