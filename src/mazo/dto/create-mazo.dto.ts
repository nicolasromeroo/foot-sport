import { ApiProperty } from '@nestjs/swagger';

export class CreateMazoDto {
    @ApiProperty({
        description: 'Nombre del mazo',
        example: 'Mi Mazo de Fútbol'
    })
    nombre: string;

    @ApiProperty({
        description: 'ID del usuario dueño del mazo',
        example: 1
    })
    usuarioId: number;
}
