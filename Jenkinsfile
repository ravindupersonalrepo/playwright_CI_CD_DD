pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  environment {
    CI = 'true'
    PROJECT_DIR = "${env.WORKSPACE}"
  }

  stages {
    stage('Resolve mode') {
      steps {
        script {
          env.RESOLVED_PIPELINE_MODE = resolvePipelineMode()
          echo "Pipeline mode: ${env.RESOLVED_PIPELINE_MODE}"
          echo "BRANCH_NAME: ${env.BRANCH_NAME}"
          echo "CHANGE_ID: ${env.CHANGE_ID}"
          echo "CHANGE_TARGET: ${env.CHANGE_TARGET}"
        }
      }
    }

    stage('Checkout') {
      steps {
        dir(env.PROJECT_DIR) {
          bat 'git status'
        }
      }
    }

    stage('Install dependencies') {
      when {
        expression { env.RESOLVED_PIPELINE_MODE != 'cleanup-code-review-tags' && env.RESOLVED_PIPELINE_MODE != 'skip' }
      }
      steps {
        dir(env.PROJECT_DIR) {
          bat 'npm install'
          bat 'npx playwright install chromium'
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
        dir(env.PROJECT_DIR) {
          script {
            bat 'if exist code-review-list.txt del /f /q code-review-list.txt'

            def exitCode = bat(
              script: '@npx playwright test --project=chromium --grep "@codeReview" --list > code-review-list.txt 2>&1',
              returnStatus: true
            )

            def listOutput = readFile("${env.PROJECT_DIR}\\code-review-list.txt")
            echo listOutput

            if (listOutput.contains('No tests found') || listOutput.contains('Total: 0 tests in 0 files')) {
              echo 'No @codeReview tests found. Skipping code review execution.'
            } else if (exitCode != 0) {
              error('Failed while listing @codeReview tests.')
            } else {
              bat 'npx playwright test --project=chromium --grep "@codeReview"'
            }
          }
        }
      }
    }

    stage('Main smoke tests') {
      when {
        expression { env.RESOLVED_PIPELINE_MODE == 'main-smoke' }
      }
      steps {
        dir(env.PROJECT_DIR) {
          bat 'npx playwright test --project=chromium --grep "@smoke"'
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
        dir(env.PROJECT_DIR) {
          bat 'npx playwright test --project=chromium --grep "@regression"'
        }
      }
    }

    stage('Cleanup code review tags') {
      when {
        expression { env.RESOLVED_PIPELINE_MODE == 'cleanup-code-review-tags' }
      }
      steps {
        dir(env.PROJECT_DIR) {
          bat 'python scripts\\cleanup-code-review-tags.py'
          bat 'git status'
        }
      }
    }

    stage('Skip build') {
      when {
        expression { env.RESOLVED_PIPELINE_MODE == 'skip' }
      }
      steps {
        echo 'No matching automatic flow for this branch/build. Skipping cleanly.'
      }
    }
  }

  post {
    always {
      dir(env.PROJECT_DIR) {
        junit allowEmptyResults: true, testResults: 'test-results/results.xml'
        archiveArtifacts allowEmptyArchive: true, artifacts: 'monocart-report/**,playwright-report/**,test-results/**'
      }
    }
  }
}

def resolvePipelineMode() {
  if (env.CHANGE_ID && env.CHANGE_TARGET == 'develop') {
    return 'code-review'
  }

  if (env.CHANGE_ID && env.CHANGE_TARGET == 'main') {
    return 'main-smoke'
  }

  if (!env.CHANGE_ID && env.BRANCH_NAME == 'develop') {
    return 'cleanup-code-review-tags'
  }

  if (!env.CHANGE_ID && env.BRANCH_NAME == 'main') {
    return 'main-smoke'
  }

  return 'skip'
}
