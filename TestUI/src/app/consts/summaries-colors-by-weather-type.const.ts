import { WeathersTypesEnum } from "../enums/weathers-types.enum";

export const SummariesColorsByWeatherType: Record<WeathersTypesEnum, string> = {
    [WeathersTypesEnum.Freezing]: "cyan",
    [WeathersTypesEnum.Bracing]: "cyan",
    [WeathersTypesEnum.Chilly]: "cyan",
    [WeathersTypesEnum.Mild]: "green",
    [WeathersTypesEnum.Balmy]: "green",
    [WeathersTypesEnum.Cool]: "green",
    [WeathersTypesEnum.Warm]: "orange",
    [WeathersTypesEnum.Hot]: "orange",
    [WeathersTypesEnum.Sweltering]: "red",
    [WeathersTypesEnum.Scorching]: "red"
}