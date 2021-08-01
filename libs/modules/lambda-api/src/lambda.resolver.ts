import { CurrentUser, GqlAuthGuard, JwtPayload, Void } from '@codelab/backend'
import { Injectable, UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Lambda, LambdaPayload } from './lambda.model'
import { LambdaService } from './lambda.service'
import { CreateLambdaInput } from './use-cases/create-lambda/create-lambda.input'
import { CreateLambdaService } from './use-cases/create-lambda/create-lambda.service'
import {
  DeleteLambdaInput,
  DeleteLambdaService,
} from './use-cases/delete-lambda'
import {
  ExecuteLambdaInput,
  ExecuteLambdaService,
} from './use-cases/execute-lambda'
import { GetLambdaInput } from './use-cases/get-lambda/get-lambda.input'
import { GetLambdaService } from './use-cases/get-lambda/get-lambda.service'
import { GetLambdasService } from './use-cases/get-lambdas/get-lambdas.service'
import { UpdateLambdaInput } from './use-cases/update-lambda/update-lambda.input'
import { UpdateLambdaService } from './use-cases/update-lambda/update-lambda.service'

@Resolver(() => Lambda)
@Injectable()
export class LambdaResolver {
  constructor(
    private readonly lambdaService: LambdaService,
    private readonly createLambdaService: CreateLambdaService,
    private readonly deleteLambdaService: DeleteLambdaService,
    private readonly getLambdasService: GetLambdasService,
    private readonly getLambdaService: GetLambdaService,
    private readonly executeLambdaService: ExecuteLambdaService,
    private readonly updateLambdaService: UpdateLambdaService,
  ) {}

  @Mutation(() => Lambda)
  @UseGuards(GqlAuthGuard)
  async createLambda(
    @Args('input') input: CreateLambdaInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const lambda = await this.createLambdaService.execute({
      input,
      ownerId: user.sub,
    })

    await this.lambdaService.createLambda(lambda)

    return lambda
  }

  @Mutation(() => Void, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async deleteLambda(@Args('input') input: DeleteLambdaInput) {
    const lambda = await this.deleteLambdaService.execute(input)

    await this.lambdaService.deleteLambda(lambda)

    return lambda
  }

  @Mutation(() => Lambda, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async updateLambda(@Args('input') input: UpdateLambdaInput) {
    const lambda = await this.updateLambdaService.execute(input)

    await this.lambdaService.updateLambda(lambda)

    return lambda
  }

  @Query(() => Lambda, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async getLambda(@Args('input') input: GetLambdaInput) {
    return this.getLambdaService.execute(input)
  }

  @Mutation(() => LambdaPayload, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async executeLambda(@Args('input') input: ExecuteLambdaInput) {
    const lambda = await this.getLambdaService.execute(input)
    const results = await this.lambdaService.executeLambda(lambda)

    return { payload: results }
  }

  @Query(() => [Lambda])
  @UseGuards(GqlAuthGuard)
  async getLambdas(@CurrentUser() user: JwtPayload) {
    return this.getLambdasService.execute({ ownerId: user.sub })
  }
}
