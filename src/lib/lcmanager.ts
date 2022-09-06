import AuthManager from './authmanager';
import ProblemManager from './problemmanager';

class LCManager {
  private static instance: LCManager;
  private authManager: AuthManager;
  private problemManager: ProblemManager;

  private constructor() {
    this.authManager = AuthManager.getInstance();
    this.problemManager = ProblemManager.getInstance();
  }

  static getInstance() {
    if (!LCManager.instance) {
      this.instance = new LCManager();
    }

    return this.instance;
  }

  async login(username: string, password: string) {
    return await this.authManager.login(username, password);
  }

  async queryProblems(
    slug: string,
    filter: object,
    limit: number,
    skip: number
  ) {
    return await this.problemManager.getProblems(slug, filter, limit, skip);
  }

  async queryProblem(title_slug: string) {
    return await this.problemManager.getProblemDetail(title_slug);
  }

  async testSolution(
    slug: string,
    data_input: string,
    judgeType: string,
    lang: string,
    question_id: string,
    typed_code: string
  ) {
    return await this.problemManager.testSolution(
      slug,
      data_input,
      judgeType,
      lang,
      question_id,
      typed_code
    );
  }

  async submitSolution(
    slug: string,
    lang: string,
    question_id: string,
    typed_code: string
  ) {
    return await this.problemManager.submitSolution(
      slug,
      lang,
      question_id,
      typed_code
    );
  }
}

export default LCManager;
