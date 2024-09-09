import { Controller, Route,Post, Path } from "tsoa";
import { ApplyService } from "../user-service/user-apply-service";



@Route('/v1/user')
export class Apply extends Controller{
    private applyService = new ApplyService()
    @Post('/apply/{id}')
    public async applyJob(
        @Path('id') id: string
    ): Promise<any>{
        const applyCv = await this.applyService.ApplyCV(id)
        return applyCv
    }
}