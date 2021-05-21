import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { SummonerService } from "./summoner.service";

@Controller("summoner")
export class SummonerController {
  constructor(public service: SummonerService) {}

  // get data by summoner
  @Get(":summonerName")
  async getSummoner(@Param() param) {
    return await this.service.getLolInfo(param.summonerName);
  }

  // get masteries
  @Get(":summonerName/masteries")
  async getMasteries(@Param() param) {
    return await this.service.getMasteries(param.summonerName);
  }

  // associate user id with summoner data
  @Post()
  async postSummoner(@Body() body) {
    return await this.service.addSummonerToUser(body);
  }

  // update champion base
  @Post("/champions-update")
  async postChampionsUpdate(@Param() param) {
    return await this.service.updateChampions();
  }
}
