pipeline {
    agent {
        // Stages run on the master by default.
        label 'master'
    }
    stages {
        stage('Install linchpin') {
            options { skipDefaultCheckout() }
            environment {
                WELDER_CI_REPO = credentials('welder_ci_repo')
            }
            // This stage should be in its own job, which regularly updates the cinch install in the master.
            // Note that the ansible virtualenv is created just to ensure a supported version of ansible is
            // installed so that cinch itself, and its dependencies, can be installed. This virtualenv is
            // not needed by other jobs or stages, but the two virtualenvs that it creates *will* be needed
            // by other jobs and stages.
            steps{
                checkout changelog: false, poll: false, scm: [$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'RelativeTargetDirectory', relativeTargetDir: 'ci']], submoduleCfg: [], userRemoteConfigs: [[url: "${WELDER_CI_REPO}"]]]
                dir('ci/openstack') {
                    sh """
                        printenv
                        virtualenv ansible.venv && source ansible.venv/bin/activate
                        pip install --upgrade setuptools pip
                        pip install 'ansible==2.4.1.0'

                        export PYTHONUNBUFFERED=1 # Enable real-time output for Ansible
                        ansible-playbook -i localhost, -c local playbooks/install-linchpin-rhel7.yml \
                            -e delete_venv="true"

                        deactivate
                    """
                }
            }
        }
        stage('Provision') {
            steps {
                dir('ci/openstack') {
                    sh """
                        source "\${JENKINS_HOME}/opt/linchpin/bin/activate"
                        linchpin -v --creds-path credentials -w "\$(pwd)" up

                        chmod 600 keystore/ci-ops-central
                        ansible-playbook -v -i inventories/composer-test.inventory playbooks/provision.yml
                        deactivate
                    """
                }
            }
            post {
                // no post state for "not successful", but we want to skip the
                // test phase any time provisioning is not successful and mark
                // this build as having not been built in that case. The teardown
                // post-phase will always run regardless of the current result.
                always {
                    script {
                        if (currentBuild.currentResult != "SUCCESS") {
                            manager.buildNotBuilt()
                        }
                    }
                }
            }
        }
        stage('End to End Test') {
            options { skipDefaultCheckout() }
            environment {
                GITHUB_REPO_API_TOKEN = credentials('github_repo_api_token')
                AWS_ACCESS_KEY = credentials('aws_access_key')
                AWS_SECRET_KEY = credentials('aws_secret_key')
            }
            steps {
                dir('ci/openstack') {
                    sh """
                        virtualenv ansible.venv && source ansible.venv/bin/activate
                        pip install --upgrade setuptools pip
                        pip install 'ansible==2.4.1.0'

                        export PYTHONUNBUFFERED=1 # Enable real-time output for Ansible
                        ansible-playbook -v -i inventories/composer-test.inventory playbooks/tests.yml \
                            -e delete_venv="true"

                        deactivate
                    """
                }
            }
        }
    }
    post {
        // uses default 'master' agent, runs in same workspace and node as provision step
        success {
            // Attempt to destroy the deployed instance entirely by running linchpin destroy if all tests passed.
            dir('ci/openstack') {
                sh """
                    source "\${JENKINS_HOME}/opt/linchpin/bin/activate"
                    linchpin -v --creds-path credentials -w "\$(pwd)" destroy || echo \
                        "Linchpin destroy failed, VM may need to be manually removed from provider."
                    deactivate
                """
            }
        }
        always {
            cleanWs()
        }
    }
    options {
        checkoutToSubdirectory('welder')
        timestamps()
        buildDiscarder(logRotator(numToKeepStr:'10'))
        timeout(time: 2, unit: 'HOURS')
    }
}
