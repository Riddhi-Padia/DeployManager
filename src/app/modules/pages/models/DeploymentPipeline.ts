export interface DeploymentPipeline {
  executionId: string;        // short 8-char ID
  status: string;
  sourceAction: string;
  revisionId: string;
  revisionSummary: string;
  revisionUrl: string;
  triggerType: string;
  triggerDetail: string;
  started: string;            // formatted date
  duration: string;           // formatted duration
  completed: string;          // formatted date
}
