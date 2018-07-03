export const getCourseParts = (id) => {
    return {
        matriisit: {
            taso1: ['matriisien yhteenlasku', 'matriisien muodostus'],
            taso2: ['matriisien kertolasku', 'matriisien pyörittely'],
            taso3: ['matriiseilla päteminen', 'matriisien heiluttelu', 'matriisien superlasku', 'supreme matriisimestari']
        },
        'vektorit ja muut': {
            taso1: ['vektorien yhteenlasku', 'vektorien muodostus'],
            taso2: ['vektorien kertolasku', 'pyörittely', 'vektorien 3D piirtely'],
            taso3: ['vektorien äärimmäinen heiluttelu']
        }
    }
}
