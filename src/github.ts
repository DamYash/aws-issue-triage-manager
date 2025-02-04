import * as github from '@actions/github';
import * as core from '@actions/core';
import {IIssueData} from './issue';

export interface IRepo {
  owner: string;
  repo: string;
}

export class GithubApi {
  private octokit;
  private repo: IRepo;
  private issueNumber: number | undefined;

  constructor(token: string) {
    this.octokit = new github.GitHub(token);
    this.repo = github.context.repo;

    if (github.context.payload.issue) {
      this.issueNumber = github.context.payload.issue.number;
    } else if (github.context.payload.pull_request) {
      this.issueNumber = github.context.payload.pull_request.number;
    } else {
      core.setFailed('Error retrieving issue number');
    }
  }

  public async setIssueAssignees(assignees: string[]) {
    if (!assignees.length) return;
    await this.octokit.issues.addAssignees({
      ...this.repo,
      issue_number: this.issueNumber,
      assignees,
    });
  }

  public async setIssueLabels(labels: string[]) {
    if (!labels.length) return;
    await this.octokit.issues.addLabels({
      ...this.repo,
      issue_number: this.issueNumber,
      labels,
    });
  }

  public async getIssueContent(): Promise<IIssueData> {
    const {data} = await this.octokit.issues.get({
      ...this.repo,
      issue_number: this.issueNumber,
    });

    const isValidIssueType = this.verifyIssueType(data.pull_request);

    if (!isValidIssueType) return {isValidIssueType: false};

    const title: string = data.title;
    const body: string = data.body;
    const labels: string[] = [];

    for (const label of data.labels) {
      labels.push(label.name.toString());
    }

    return {
      title,
      body,
      labels,
      isValidIssueType,
    };
  }

  public verifyIssueType(data): boolean {
    const target = core.getInput('target', {required: false});

    if (target === 'both') {
      return true;
    } else if (target === 'issues') {
      if (!data) {
        return true;
      } else {
        return false;
      }
    } else if (target === 'pull-requests') {
      if (data) {
        return true;
      } else {
        return false;
      }
    }

    return true;
  }
}
