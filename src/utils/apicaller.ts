import axios from 'axios';
import {GraphQLClient} from 'graphql-request';
import {
  Credential,
  GraphQLRequestOptions,
  HttpRequestOptions,
  Urls,
} from './interfaces';

class ApiCaller {
  private static instance: ApiCaller;

  credential: Credential;
  urls: Urls;

  private constructor() {
    this.credential = {session: '', csrftoken: ''};
    this.urls = {
      base: 'https://leetcode.com/',
      graphql: 'https://leetcode.com/graphql/',
    };
  }

  setCredential(credential: Credential) {
    this.credential = credential;
  }

  static getInstance(): ApiCaller {
    if (!ApiCaller.instance) {
      ApiCaller.instance = new ApiCaller();
    }

    return ApiCaller.instance;
  }

  async HttpRequest(options: HttpRequestOptions) {
    return axios.request({
      url: this.urls.base + options.url,
      method: options.method,
      headers: {
        Cookie: `LEETCODE_SESSION=${
          ApiCaller.getInstance().credential.session
        };csrftoken=${ApiCaller.getInstance().credential.csrftoken}`,
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': this.credential.csrftoken,
        Referer: options.referer || this.urls.base,
      },
      data: JSON.stringify(options.body) || '',
    });
  }

  async GraphQLRequest(options: GraphQLRequestOptions) {
    const client = new GraphQLClient(this.urls.graphql, {
      headers: {
        Origin: options.origin || this.urls.base,
        Referer: options.referer || this.urls.base,
        LEETCODE_SESSION: this.credential.session,
        csrftoken: this.credential.csrftoken,
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': this.credential.csrftoken,
      },
    });
    return await client.request(options.query, options.variables || {});
  }
}

export default ApiCaller;
