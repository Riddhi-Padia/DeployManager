import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { DeploymentPipeline } from '../models/DeploymentPipeline';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DeployService {
  private apiUrl = environment.apiUrl;

  private accesskey: string = localStorage.getItem('AccessKey') || '';
  private secretkey: string = localStorage.getItem('SecretKey') || '';
  private sessionToken: string = localStorage.getItem('SessionToken') || '';
  private projectNameUK: string = 'emspuk-dev-dynamic-pipeline';
  private projectNameIS: string = 'emspis-dev-dynamic-pipeline';
  private pipelineUK: string = 'emspuk-dev-single-pipeline';
  private pipelineIS: string = 'emspis-dev-single-pipeline';

  constructor(private http: HttpClient) { }

  // #region get private variable values
  getProjectName(region: string): string {
    if (region == 'UK')
      return this.projectNameUK;
    else if (region == 'IS')
      return this.projectNameIS;
    else
      return '';
  }

  getPipelineName(region: string): string {
    if (region == 'UK')
      return this.pipelineUK;
    else if (region == 'IS')
      return this.pipelineIS;
    else
      return '';
  }

  getAccessKey(): string {
    return this.accesskey;
  }

  getSecretKey(): string {
    return this.secretkey;
  }

  getSessionToken(): string {
    return this.sessionToken;
  }
  // #endregion

  addDeployment(JSON: any): Observable<any> {
    console.log("calling on", `${this.apiUrl}/start-build`);
    return this.http.post(`${this.apiUrl}/start-build`, JSON);
  }

  getDeployments(payload: any): Observable<DeploymentPipeline[]> {
    console.log("calling on", `${this.apiUrl}/pipeline-history`);
    return this.http.post<any>(`${this.apiUrl}/pipeline-history`, payload).pipe(
      map(response => {
        console.log(response);
        if (!response || !Array.isArray(response.history)) {
          return [];
        }
        return response.history.map((item: any) => {
          const start = new Date(item.startTime);
          const end = new Date(item.lastUpdateTime);

          const durationMs = end.getTime() - start.getTime();
          const minutes = Math.floor(durationMs / 60000);
          const seconds = Math.floor((durationMs % 60000) / 1000);

          return {
            executionId: item.pipelineExecutionId.substring(0, 8),
            status: item.status,
            sourceAction: item.sourceRevisions?.[0]?.actionName || '',
            revisionId: item.sourceRevisions?.[0]?.revisionId || '',
            revisionSummary: this.extractCommitMessage(item.sourceRevisions?.[0]?.revisionSummary),
            revisionUrl: item.sourceRevisions?.[0]?.revisionUrl || '',
            triggerType: item.trigger?.triggerType || '',
            triggerDetail: item.trigger?.triggerDetail || '',
            started: start.toLocaleString(),
            duration: `${minutes}min ${seconds}s`,
            completed: end.toLocaleString()
          } as DeploymentPipeline;
        });
      })
    );
  }

  private extractCommitMessage(summary: string): string {
    try {
      const parsed = JSON.parse(summary);
      return parsed.CommitMessage || '';
    } catch {
      return summary;
    }
  }
}
