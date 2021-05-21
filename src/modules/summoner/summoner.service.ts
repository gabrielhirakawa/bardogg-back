import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import api from "../../service/lol";
import {
  getUserBySocialId,
  addSummonerUserDB,
  updateChampionsDB,
  getChampionsDB,
} from "../../database/mongo";
import axios from "axios";

@Injectable()
export class SummonerService {
  async getLOLSummoner(summonerName) {
    const summonerIdResponse = await api
      .get(`/lol/summoner/v4/summoners/by-name/${encodeURI(summonerName)}`, {
        headers: { "X-Riot-Token": process.env.LOL_KEY },
      })
      .catch((e) => {
        throw new HttpException(
          e.response.data ? e.response.data.status : "error lol api",
          HttpStatus.NOT_FOUND
        );
      });

    return summonerIdResponse.data;
  }

  async getLolInfo(summonerName) {
    const { id, profileIconId, summonerLevel } = await this.getLOLSummoner(
      summonerName
    );

    const responseRanked = await api
      .get(`/lol/league/v4/entries/by-summoner/${id}`, {
        headers: { "X-Riot-Token": process.env.LOL_KEY },
      })
      .catch((e) => {
        throw new HttpException(
          e.response.data ? e.response.data.status : "error lol api",
          HttpStatus.NOT_FOUND
        );
      });

    const { tier, rank, wins, losses, queueType } = responseRanked.data[1]
      ? responseRanked.data[1]
      : responseRanked.data[0];

    return {
      iconUrl: `${process.env.LOL_ICONS}/${profileIconId}.png`,
      summonerLevel,
      tier,
      rank,
      wins,
      losses,
      queueType,
      winRate: ((wins / (wins + losses)) * 100).toFixed(1),
    };
  }

  async addSummonerToUser(body) {
    const summoner = await this.getLOLSummoner(body.summonerName);
    const user = await getUserBySocialId(body.id);
    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    await addSummonerUserDB(body.id, summoner).catch((e) => {
      console.log(e);
      throw new HttpException("Database error", HttpStatus.BAD_GATEWAY);
    });
    return;
  }

  async getMasteries(summonerName) {
    const { id } = await this.getLOLSummoner(summonerName);

    const masteriesApi = await api
      .get(`/lol/champion-mastery/v4/champion-masteries/by-summoner/${id}`, {
        headers: { "X-Riot-Token": process.env.LOL_KEY },
      })
      .catch((e) => {
        throw new HttpException(
          e.response.data ? e.response.data.status : "error lol api",
          HttpStatus.BAD_GATEWAY
        );
      });

    const champsObj = await getChampionsDB();
    const champs = [];
    const masteries = [];

    Object.keys(champsObj).forEach(function (item) {
      champs.push(champsObj[item]);
    });

    for (let i = 0; i < 10; i++) {
      const found = champs.find(
        (element) => element.key == masteriesApi.data[i].championId
      );
      masteries.push({
        name: found.name,
        championPoints: masteriesApi.data[i].championPoints,
        championLevel: masteriesApi.data[i].championLevel,
        chestGranted: masteriesApi.data[i].chestGranted,
        img: `http://ddragon.leagueoflegends.com/cdn/11.7.1/img/champion/${found.image.full}`,
      });
    }

    return masteries;
    // return masteriesApi.data;
  }

  async updateChampions() {
    const resp = await axios
      .get(
        "http://ddragon.leagueoflegends.com/cdn/11.7.1/data/pt_BR/champion.json"
      )
      .catch((e) => {
        throw new HttpException("error lol api", HttpStatus.BAD_GATEWAY);
      });

    const { data } = resp.data;

    await updateChampionsDB(data);
  }
}
