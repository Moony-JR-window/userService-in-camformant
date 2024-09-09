import { ApplyRepo } from "../user-repositery/user-apply-repo";


export class ApplyService extends ApplyRepo{
    private applyRepo = new ApplyRepo();

    public async ApplyCV(id: string): Promise<any> {
        console.log(id);
        const applyCv= await this.applyRepo.ApplyCV(id)
        return applyCv
        
    }
}