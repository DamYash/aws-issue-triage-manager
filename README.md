
1. Install dependencies with NPM

```sh
npm install
```

2. Build the JS files

```sh
npm run build
```

## Tests

Run all unit tests using Jest.

```sh
npm run test
```

_Append `-- --watch` to auto run tests when changes are saved._

## Inputs

### parameters

Parameters should take the form

```json
[
  {
    "area": "area",
    "keywords": ["keywords"],
    "labels": ["labels"],
    "assignees": ["assignees"]
  }
]
```

### default-area

If no keywords are detected in your issue, set these default labels and assignees

```json
{
  "labels": ["labels"],
  "assignees": ["assignees"]
}
```

### target

Select whether to run only on issues, pull requests, or both. Valid values are `issues`, `pull-requests`, and `both`

The default value is **both**

### area-is-keyword

Setting this to `true` will consider the title of the area to be a keyword of that area

### excluded-expressions

You can exclude certain expressions from being potentially counted as keywords. This is useful if you have issue templates which may contain keywords.
The input should be an array with expressions to exclude separated by bars. Ex. `[ Expression 1 | Expression 2 ]`

### similarity

A value of 0 means keywords have to match exactly. The algorithm used to determine the similarity of two strings is [Levenshtein Distance](https://en.wikipedia.org/wiki/Levenshtein_distance)

The default value is **.125**

### body-value

A set constant for how much each keyword detected in the body of the issue is worth

The default value is **.025**

### included-labels

Conditionally run this action based on the labels present on the issue. Will only run on issues with the specified labels

If no input is provided, the action will always run

### excluded-labels

Conditionally run this action based on the labels present on the issue. Will not run on issues with the specified labels

Overrides `included-labels`

## Example

```yaml
name: 'Set labels and assignees'
on:
  issues:
    types: [opened]
  pull_request:
    types: [opened]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: aws-github-ops/aws-issue-triage-manager@main
        with:
          parameters: '[ {"area":"s3", "keywords": ["s3", "bucket"], "labels": ["s3"], "assignees": ["s3Dev"]}, {"area": "ec2", "keywords": ["ec2", "instance"], "labels": ["ec2"], "assignees": ["ec2Dev"]}]'
          github-token: '${{ secrets.GITHUB_TOKEN }}'
          excluded-expressions: '[ TypeScript | Java | Python ]'
```

## Contributing

We welcome community contributions and pull requests. See [CONTRIBUTING.md](./CONTRIBUTING.md) for information on how to contribute to this project

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This project is licensed under the Apache-2.0 License.
