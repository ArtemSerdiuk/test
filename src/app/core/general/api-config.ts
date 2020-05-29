import { environment } from '../../../environments/environment';

export class ApiConfig {
  public static apiKey: string = environment.apiKey;
  public static basePath: string = environment.basePath;
  public static gifsPath: string = `${ApiConfig.basePath}/v1/gifs`;
  public static searchPath: string = `${ApiConfig.gifsPath}/search`;
}
