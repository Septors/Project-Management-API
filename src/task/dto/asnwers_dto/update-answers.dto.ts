import { PartialType } from "@nestjs/mapped-types";
import { CreateAnswerDto } from "./create-answers.dto";

export class UpdateAsnwersDto extends PartialType(CreateAnswerDto){}