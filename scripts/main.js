/* global $, applist, location */

// STORE REFERENCES TO HTML ELEMENTS
var $body = $(document.body)
var $showNewAppFormButton = $('#new-app-btn')
var $newAppForm = $('#form-new-app')
var $updateAppForm = $('#form-update-app')
var $cancelNewAppFormButton = $('#cancel-create')
var $appList = $('#app-list')
var $goBackButton = $('#go-back-btn')
var $startAppButton = $('#start-button')
var $stopAppButton = $('#stop-button')
var $deleteButton = $('#delete-button')
var $editButton = $('#edit-button')
var $submitButton = $('#js-change-appname')

// INIT APP
$(document).ready(handleRoute)
$(window).on('hashchange', handleRoute)

// EVENT HANDLERS
$showNewAppFormButton.on('click', function () {
  setRoute('new')
})

$newAppForm.on('submit', function (event) {
  event.preventDefault()

  // create app array for exisiting apps
  var app = {
    name: $('#empty-text').val()
  }
  if (app.name) {
    applist.add(app)

    .then(function (app) {
      setRoute(app.id)
    })
  }
})

$cancelNewAppFormButton.on('click', function () {
  setRoute('')
})

$appList.on('click', 'li', function (event) {
  var li = event.currentTarget
  var id = $(li).data('id')
  setRoute(id)
})

$goBackButton.on('click', function () {
  setRoute('')
})

$editButton.on('click', function(event){
  console.log('test')
$body.attr('data-state', 'update-app')
//  if($submitButton.clicked == true)
// {
//
// }
})
$updateAppForm.on('submit', function (event) {
  event.preventDefault()
  //rendeupdateform()

  var changed = $('#rename-app').val()
  var app = {
    id: $('#name-app').data('id'),
    name: changed
  }
  if (changed) {
    applist.update(app)

    .then(function (app) {
      $('#name-app').text(app.name)
      $('#folder').text('~Hoodie/' + app.name)
      //$updateAppForm.closest('.modal').modal('hide')
    })
  }
})

// $updateAppForm.on('submit', function (event) {
//   event.preventDefault()
//   //rendeupdateform()
//
//   var changed = $('#rename-app').val()
//   var app = {
//     id: $('#name-app').data('id'),
//     name: changed
//   }
//   if (changed) {
//     applist.update(app)
//     .then(function (app) {
//       $('#name-app').text(app.name)
//       $('#folder').text('~Hoodie/' + app.name)
//       //$updateAppForm.closest('.modal').modal('hide')
//     })
//   }
// })

$deleteButton.on('click',function(event){
  event.preventDefault()
  var id = $('#detail-app-container').data('id')
  console.log('#detail-app-container data-id', id)
  //debugger
  applist.remove(id)

  .then (function(app){
    setRoute('')
  })
})

// start button
$startAppButton.on('click', function () {
  var app = {
    id: $('#detail-app-container').data('id')
  }
  applist.start(app)

  .then(function(app){
    $('#detail-app-container').attr('data-state','started')
  })
})

// stop button
$stopAppButton.on('click', function () {
  var app = {
    id:  $('#detail-app-container').data('id')
  }
  applist.stop(app)

  .then(function(app){
    $('#detail-app-container').attr('data-state','stopped')
  })
})

// HELPER METHODS
function setRoute (path) {
  location.hash = '#' + path
}

function handleRoute () {
  var path = location.hash.substr(1)

  if (path === '') {
    console.log('route: dashboard')
    renderAppList()
    return
  }

  if (path === 'new') {
    console.log('route: new app form')
    renderNewAppForm()
    return
  }

  console.log(`route: app detail (id: ${path})`)
  renderAppDetail(path)
}

function renderNewAppForm () {
  $body.attr('data-state', 'new-app')
  $("#empty-text").val("")
}

function renderAppDetail (id) {
  applist.find(id)

  .then(function (app) {
    $('#name-app').html(app.name)
    $('#detail-app-container').attr('data-state',app.state)
    $('#detail-app-container').data('id', app.id)
    $('#folder').html('~Hoodie/' + app.name)
    $body.attr('data-state', 'app-detail')
  })
  $("#rename-app").val("")
}

// function rendeupdateform(){
//     $body.attr('data-state', 'update-app')
// }

function renderAppList () {
  $body.attr('data-state', 'dashboard')
  $appList.empty()
  applist.findAll()

  .then(function (apps) {
    apps.forEach(function (app) {
      var html = `
      <li data-id="${app.id}" class="list-group-item"
      <button type="button" class="btn btn-lg btn-block">
      ${app.name || '-'}
      <i class="glyphicon glyphicon-play-circle pull-right"></i>
      </button>
      </li>
      `
      $appList.append(html)
    })
  })
}
