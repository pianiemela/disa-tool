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

const selfAssesmentData = {
    courseInstance: {
        id: 1,
        fin_name: 'Linis',
        course_instance_objectives: [
            {
                id: 1,
                category: 'matriisit',
                objectives: ['matriisien yhteenlasku', 'matriisien muodostus',
                    'matriisien kertolasku', 'matriisien pyörittely',
                    'matriiseilla päteminen', 'matriisien heiluttelu', 'matriisien superlasku', 'supreme matriisimestari']
            },
            {
                id: 2,
                category: 'vektorit ja muut',
                objectives: [
                    'vektorien yhteenlasku', 'vektorien muodostus',
                    'vektorien kertolasku', 'pyörittely', 'vektorien 3D piirtely',
                    'vektorien äärimmäinen heiluttelu']
            }

        ]

    }
}


export const getSelfAssesmentData = data => {
    const apiresponse = {
        message: 'success',
        data: {
            selfAssesmentData: selfAssesmentData
        }
    }

    const action = {
        type: 'GET_SELF_ASSESMENT_DATA',
        apiresponse
    }

    return new Promise((resolve, reject) => {
        setTimeout(resolve, 100, action)
      })

}




