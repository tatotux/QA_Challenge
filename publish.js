/* eslint-disable no-undef */
const { Publisher } = require('@pact-foundation/pact')
const path = require('path')
const childProcess = require('child_process')

const exec = (command) => childProcess.execSync(command).toString().trim()

// Usually, you would just use the CI env vars, but to allow these examples to run from
// Local development machines, we'll fall back to the git command when the env vars aren't set.
const gitSha = process.env.TRAVIS_COMMIT || exec('git rev-parse HEAD || echo LOCAL_DEV')
const branch = process.env.TRAVIS_BRANCH || exec('git rev-parse --abbrev-ref HEAD || echo LOCAL_DEV')

const opts = {
  pactFilesOrDirs: [path.resolve(process.cwd(), 'pacts')],
  pactBroker: 'https://tatotux.pactflow.io',
  pactBrokerToken: process.env.PACTFLOW_TOKEN,
  consumerVersion: gitSha,
  tags: [branch]
}

new Publisher(opts)
  .publishPacts()
  .then(() => {
    console.log('Pact contract publishing complete!')
    console.log('')
    console.log('Head over to https://tatotux.pactflow.io to see your published contracts.')
  })
  .catch((e) => {
    console.log('Pact contract publishing failed: ', e)
  })
