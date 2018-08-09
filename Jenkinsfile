pipeline {
    agent {
        // Stages run on the master by default; the "test" phase should override this to ensure
        // tests are run on the provisioned slave.
        label 'master'
    }
    stages {
        stage('Install cinch') {
            // This stage should be in its own job, which regularly updates the cinch install in the master.
            // Note that the ansible virtualenv is created just to ensure a supported version of ansible is
            // installed so that cinch itself, and its dependencies, can be installed. This virtualenv is
            // not needed by other jobs or stages, but the two virtualenvs that it creates *will* be needed
            // by other jobs and stages.
            steps{
                git 'https://github.com/RedHatQE/cinch.git'

                // It is recommended to export "sh" blocks as actual shell scripts and then call the script
                // from the Jenkinsfile. They are included here, inline and outdented, to make it easier to
                // see exactly what's happening, step-by-step.
                sh """
                    # from https://raw.githubusercontent.com/RedHatQE/cinch/master/jjb/install-rhel7.yaml
                    virtualenv ansible.venv && source ansible.venv/bin/activate
                    pip install --upgrade setuptools pip
                    pip install 'ansible==2.4.1.0'

                    export PYTHONUNBUFFERED=1 # Enable real-time output for Ansible
                    ansible-playbook -i localhost, -c local cinch/playbooks/install-rhel7.yml \
                        -e delete_venv="true"

                    deactivate
                """
            }
        }
        stage('Provision') {
            environment {
                COMPOSER_CI_REPO = credentials('composer_ci_repo')
            }
            steps {
                git "${COMPOSER_CI_REPO}"
                // checkout changelog: false, poll: false, scm: [$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'RelativeTargetDirectory', relativeTargetDir: 'ci']], submoduleCfg: [], userRemoteConfigs: [[url: "${COMPOSER_CI_REPO}"]]]
                dir('openstack') {
                    sh """
                        source "\${JENKINS_HOME}/opt/linchpin/bin/activate"
                        # --
                        # This echo is needed in the linchpin workspace for all linchpins to work hereafter,
                        # but it only needs to be done once, so it's done here before the first linchpin call.
                        # It is needed to deal with https://github.com/CentOS-PaaS-SIG/linchpin/issues/377,
                        # and may become unnecessary in future releases of linchpin.
                        echo "localhost ansible_python_interpreter=\$(which python)" > localhost
                        # --
                        linchpin -v --creds-path credentials -w "\$(pwd)" up
                        deactivate

                        chmod 600 keystore/ci-ops-central
                        source "\${JENKINS_HOME}/opt/cinch/bin/activate"
                        cinch inventories/composer-test.inventory
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
        stage('Test') {
            agent {
                label 'composer-slave'
            }
            steps {
                checkout scm
                sh """
                    ls ~
                    printenv
                    make check
                """
            }
            when {
                expression {
                    currentBuild.currentResult == "SUCCESS"
                }
            }
            post {
                // Always attempt to capture artifacts created during the test run, but
                // do not fail if they don't exist.
                always {
                    archiveArtifacts allowEmptyArchive: true, artifacts: 'runtest-artifact'
                }
            }
        }
    }
    post {
        // uses default 'master' agent, runs in same workspace and node as provision step
        always {
            // No matter what happens above, always attempt to clean up the provisioned slave,
            // first by running cinch teardown to remove the slave from the master, and then
            // by running linchpin destroy to destroy the slave instance entirely.
            dir('openstack') {
                sh """
                    source "\${JENKINS_HOME}/opt/cinch/bin/activate"
                    # || echo here so we still linchpin destroy even if cinch has problems,
                    # and print a useful error to the user
                    teardown inventories/composer-test.inventory || echo \
                        "Cinch teardown failed, slave may need to be manually removed from jenkins master."
                    deactivate
                    # source "\${JENKINS_HOME}/opt/linchpin/bin/activate"
                    # linchpin -v --creds-path credentials -w "\$(pwd)" destroy || echo \
                    #     "Linchpin destroy failed, VM may need to be manually removed from provider."
                    # deactivate
                """
            }
            cleanWs()
        }
    }
    options {
        skipDefaultCheckout()
        timestamps()
        buildDiscarder(logRotator(numToKeepStr:'10'))
        timeout(time: 2, unit: 'HOURS')
    }
}
