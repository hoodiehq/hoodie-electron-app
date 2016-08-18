/* global $, applist, location */

// STORE REFERENCES TO HTML ELEMENTS
var $body = $(document.body)
var $showNewAppFormButton = $('#new-app-btn')
var $newAppForm = $('#form-new-app')
var $updateAppForm = $('#form-update-app')
var $cancelNewAppFormButton = $('#cancel-create')
var $appList = $('#app-list')
var $goBackButton = $('#go-back-btn')
var $startStopAppButton = $('#main-button')

// INIT APP
$(document).ready(function () {
  route()
})
$(window).on('hashchange', function () {
  route()
})

// EVENT HANDLERS
$showNewAppFormButton.on('click', function () {
  setRoute('new')
})

$newAppForm.on('submit', function (event) {
  event.preventDefault()

  // create app array for exisiting apps
  var appname = $('#empty-text').val()
  var app = {
    name: appname
  }
  if (app.name) {
    applist.add({
      name: appname
    })
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

$updateAppForm.on('submit', function (event) {
  event.preventDefault()
  var changed = $('#rename-app').val()
  $('#name-app').text(changed)
  $('#folder').text('~Hoodie/' + changed)
  $updateAppForm.closest('.modal').modal('hide')
})

// toggle start/stop button
$startStopAppButton.on('click', function () {
  $startStopAppButton.find('i').toggleClass('glyphicon-play glyphicon-stop')
  $startStopAppButton.toggleClass('main-button')
  // check
  $('#link-details').toggle()
  // change
  var label = $startStopAppButton.find('span').text().trim() === 'Start' ? 'Stop' : 'Start'
  $startStopAppButton.find('span').text(label)
})

// HELPER METHODS

function setRoute (path) {
  location.hash = '#' + path
}
function route () {
  var path = location.hash.substr(1)

  if (path === '') {
    renderAppList()
    console.log('route: dashboard')
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
}

function renderAppDetail (id) {
  applist.find(id)

  .then(function (app) {
    $('#name-app').html(app.name)
    $('#folder').html('~Hoodie/' + app.name)
    $body.attr('data-state', 'app-detail')
  })
}

function renderAppList () {
  $body.attr('data-state', 'dashboard')
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
