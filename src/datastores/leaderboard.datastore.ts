import { LeaderboardEntry, PrismaClient } from "@prisma/client";

export default class LeaderboardEntryDatastore {
  private prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = new PrismaClient();
  }

  async getAll(): Promise<LeaderboardEntry[]> {
    const leaderboardEntries =
      await this.prismaClient.leaderboardEntry.findMany();
    return leaderboardEntries;
  }

  async getByUsername(username: string): Promise<LeaderboardEntry | null> {
    const leaderboardEntry = await this.prismaClient.leaderboardEntry.findFirst(
      {
        where: { username },
      }
    );

    return leaderboardEntry;
  }

  async create(data: {
    username: string;
    score: number;
    rank: number;
  }): Promise<LeaderboardEntry> {
    const leaderboardEntry = await this.prismaClient.leaderboardEntry.create({
      data,
    });
    return leaderboardEntry;
  }

  async update(
    id: number,
    data: Partial<LeaderboardEntry>
  ): Promise<LeaderboardEntry> {
    const updatedLeaderBoardEntry =
      await this.prismaClient.leaderboardEntry.update({
        where: { id },
        data: data,
      });

    return updatedLeaderBoardEntry;
  }
}
