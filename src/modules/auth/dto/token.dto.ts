import { ApiProperty } from '@nestjs/swagger';
import { string } from 'joi';

export class tokenDTO {
  @ApiProperty({
    type: string,
    example:
      'yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MDdlNTk3MmYyOTQ5ZTIxOTQwNTNhYWEiLCJpYXQiOjE2MTg4OTMxNzAsImV4cCI6MTYxOTA2NTk3MH0.vdTRSPkOzi_upMF7QPkThV7Lgdt6IG4641WMB0LLW3k',
    description: 'The access tokens to authenticate',
  })
  readonly token: string;
}
