function hilihgen(){
  Swal.fire({
    title: 'Masukan Text',
    input: 'text',
    inputAttributes: {
      autocapitalize: 'off'
    },
    showCancelButton: true,
    confirmButtonText: 'Look up',
    showLoaderOnConfirm: true,
    preConfirm: (login) => {
      return fetch(`//hilih-api-zhirrr.vercel.app/api/hilih?kata=${login}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(response.statusText)
          }
          return response.json()
        })
        .catch(error => {
          Swal.showValidationMessage(
            `Request failed: ${error}`
          )
        })
    },
    allowOutsideClick: () => !Swal.isLoading()
  }).then((data) => {
    if (data.isConfirmed) {
      Swal.fire({
        title: `${data.value.result}`
      })
    }
  })
}

function githubstalk(){
  Swal.fire({
    title: 'Masukan username',
    input: 'text',
    inputAttributes: {
      autocapitalize: 'off'
    },
    showCancelButton: true,
    confirmButtonText: 'Look up',
    showLoaderOnConfirm: true,
    preConfirm: (login) => {
      return fetch(`//api.github.com/users/${login}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(response.statusText)
          }
          return response.json()
        })
        .catch(error => {
          Swal.showValidationMessage(
            `Request failed: ${error}`
          )
        })
    },
    allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: `${result.value.login}'s avatar`,
        html: `
        name : ${result.value.name}<br>
        id : ${result.value.id}<br>
        bio : ${result.value.bio}
        `,
        imageUrl: result.value.avatar_url
      })
    }
  })
}

function jadwal(){
  Swal.fire({
    title: 'Masukan Nama Kota',
    input: 'text',
    inputAttributes: {
      autocapitalize: 'off'
    },
    showCancelButton: true,
    confirmButtonText: 'Look up',
    showLoaderOnConfirm: true,
    preConfirm: (login) => {
      return fetch(`https://api.pray.zone/v2/times/today.json?city=${login}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(response.statusText)
          }
          return response.json()
        })
        .catch(error => {
          Swal.showValidationMessage(
            `Request failed: ${error}`
          )
        })
    },
    allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: `Jadwal Sholat ${result.value.results.location.city}, ${result.value.results.location.country}`,
        html: `<br>
        Imsak : ${result.value.results.datetime[0].times.Imsak}<br>
        Sunrise : ${result.value.results.datetime[0].times.Sunrise}<br>
        Fajr : ${result.value.results.datetime[0].times.Fajr}<br>
        Dhuhr : ${result.value.results.datetime[0].times.Dhuhr}<br>
        Asr : ${result.value.results.datetime[0].times.Asr}<br>
        Sunset : ${result.value.results.datetime[0].times.Sunset}<br>
        Maghrib : ${result.value.results.datetime[0].times.Maghrib}<br>
        Isha : ${result.value.results.datetime[0].times.Isha}<br>
        Midnight : ${result.value.results.datetime[0].times.Midnight}<br>
        `,
      })
    }
  })
}

function loginfirst(){
  swal.fire("LOGIN DULU BANG", "", "error");
}
