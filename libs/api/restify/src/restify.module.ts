import { NodeModule, Node } from '@codelab/api-model'
import { Module, Inject } from '@nestjs/common'
import { InjectModel, MongooseModule } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import {
  RouterModule,
  RouterService,
  ROUTER_SERVICE,
  routerServiceProvider,
} from '@codelab/api-router'
import restify from 'express-restify-mongoose'

@Module({
  imports: [RouterModule, NodeModule],
  providers: [],
})
export class RestifyModule {
  constructor(
    @Inject(ROUTER_SERVICE) private readonly routerService: RouterService,
    @InjectModel(Node.name) private readonly nodeModel: Model<Node>,
  ) {
    // console.log(this.routerService.expressRouter)
    // console.log(this.nodeModel.schema.paths)
    restify.serve(this.routerService.expressRouter, this.nodeModel)
  }
}
