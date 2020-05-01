await loadJs('https://unpkg.com/espresso.js@1.1.0/espresso.min.js')

/* temp hack for coldemo logic */
let hashPrefix = window.location.hash.replace(/\/+$/, '')
let storageKey = 'todo-espresso'

appendHtml(`
<section id="todoapp">
  <header id="header">
    <h1>todos</h1>
    <input id="new-todo" data-ref="newItem" placeholder="What needs to be done?" autofocus>
  </header>
  <section id="main">
    <input id="toggle-all" data-ref="toggleAll" type="checkbox">
    <label for="toggle-all">Mark all as complete</label>
    <ul id="todo-list" data-ref="list">
      <li>
        <div class="view">
          <input class="toggle" data-ref="toggle" type="checkbox">
          <label data-ref="label"></label>
          <button data-ref="destroy" class="destroy"></button>
        </div>
        <input class="edit" data-ref="input">
      </li>
    </ul>
  </section>
  <footer id="footer" data-ref="footer">
    <span id="todo-count" data-ref="count"></span>
    <ul id="filters" data-ref="filters">
      <li>
        <a href="${hashPrefix}/" class="selected">All</a>
      </li>
      <li>
        <a href="${hashPrefix}/active" data-ref="active">Active</a>
      </li>
      <li>
        <a href="${hashPrefix}/completed" data-ref="completed">Completed</a>
      </li>
    </ul>
    <button id="clear-completed" data-ref="clear">Clear completed</button>
  </footer>
</section>
<footer id="info">
  <p>Double-click to edit a todo</p>
  <p>Created by <a href="https://github.com/akrymski">Artemi Krymski</a></p>
  <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
</footer>
`)

// todomvc
// https://github.com/tastejs/todomvc

let Collection  = Espresso.Collection
let Controller  = Espresso.Controller
let List        = Espresso.List
let ENTER_KEY   = 13;
let ESC_KEY     = 27;

let ToDoStore = Collection.extend({
  init: function() {
    this.clearCompleted = this.clearCompleted.bind(this);
    this.add = this.add.bind(this);
    let storedTodos = JSON.parse(localStorage.getItem(storageKey));
    if (Array.isArray(storedTodos) && storedTodos.length) {
      this.reset(storedTodos);
    } else {
      localStorage.removeItem(storageKey);
    }
    this.addListener('change', this.save.bind(this));
  },
  add: function(txt) {
    this.push({ done: false, id: this.count(), text: txt })
  },
  toggle: function(id, done) {
    this.set({ id: id, done: done })
  },
  toggleAll: function(done) {
    this.forEach(function(v, i) {
      if (v.done !== done) {
        this.set(i, { done: done, text: v.text, id: v.id })
      }
    }.bind(this))
  },
  clearCompleted: function() {
    this.set(this.active());
  },
  completed: function() {
    return this.filter(function(v) { return v.done });
  },
  active: function() {
    return this.filter(function(v) { return !v.done });
  },
  all: function() {
    return this.toArray();
  },
  save: function() {
    console.log(this.toArray())
    localStorage.setItem(storageKey, JSON.stringify(this.toArray()));
  }
});

let ToDoItem = Controller.extend({
  init: function() {
    this.listenTo(window, 'click', function(e) {
      if (this.model.editing && e.target !== this.ref.input) {
        this.set({ editing: false });
      }
    });
  },
  edit: function() {
    this.ref.input.focus();
    this.set({ editing: true });
  },
  destroy: function() {
    store.remove({ id: this.model.id });
  },
  key: function(e) {
    if (e.which === ENTER_KEY) {
      this.set({ editing: false });
      store.set({ id: this.model.id, text: e.target.value });
    }
    else if (e.which === ESC_KEY) {
      this.set({ editing: false });
      e.target.value = this.model.text;
    }
  },
  toggle: function(e) {
    store.toggle(this.model.id, e.target.checked);
  },
  render: function() {
    return {
      view: { classList: { editing: this.model.editing, completed: this.model.done } },
      label: { ondblclick: this.edit, text: this.model.text },
      destroy: { onclick: this.destroy },
      input: { value: this.model.text, onkeydown: this.key },
      toggle: { onclick: this.toggle, checked: this.model.done }
    }
  }
});

let App = Controller.extend({
  init: function() {
    this.model.filter = window.location.hash
      .replace(hashPrefix, '').replace(/^\/+/, '') || 'all';
    if (this.model.filter === 'active') this.filter({ target: this.ref.active });
    if (this.model.filter === 'completed') this.filter({ target: this.ref.completed });

    this.list = new List(ToDoItem);
    this.listenTo(store, 'change', this.render);
  },
  filter: function(e) {
    if (e === undefined) return
    if (e.target.nodeName === 'A') {
      document.querySelector('a.selected').classList.remove('selected');
      e.target.classList.add('selected')
      this.model.set({ filter: e.target.innerHTML.toLowerCase() })
    }
  },
  addItem: function(e) {
    if (e.which !== ENTER_KEY) return;
    let value = this.ref.newItem.value
    if (!value) return
    store.add(value)
    this.ref.newItem.value = '';
  },
  toggleAll: function(e) {
    store.toggleAll(e.target.checked);
  },
  clearText: function() {
    let x = store.completed().length;
    return 'Clear completed (' + x + ')'
  },
  render: function() {
    return {
      list: { include: this.list.set(store[this.model.filter]()) },
      filters: { onclick: this.filter },
      footer: { display: store.count() > 0 },
      toggleAll: { onclick: this.toggleAll },
      newItem: { onkeypress: this.addItem },
      count: { html: '<strong>'+store.active().length+'</strong> items left' },
      clear: { text: this.clearText(), onclick: store.clearCompleted, display: store.completed().length > 0 }
    }
  }
});

var store = new ToDoStore([
  { id: 0, text: 'respect to espresso.js', done: false },
  { id: 1, text: 'espresso.js 520 stars including mine', done: false },
  { id: 2, text: 'it\'s outdated but was in my early memory', done: false },
]);

new App({ view: document.getElementById('todoapp') });
/* temp hack for coldemo logic */
App = undefined

appendCss(`
#todoapp {
	background: #fff;
	background: rgba(255, 255, 255, 0.9);
	margin: 130px 0 40px 0;
	border: 1px solid #ccc;
	position: relative;
	border-top-left-radius: 2px;
	border-top-right-radius: 2px;
	box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2),
				0 25px 50px 0 rgba(0, 0, 0, 0.15);
}

#todoapp:before {
	content: '';
	border-left: 1px solid #f5d6d6;
	border-right: 1px solid #f5d6d6;
	width: 2px;
	position: absolute;
	top: 0;
	left: 40px;
	height: 100%;
}

#todoapp input::-webkit-input-placeholder {
	font-style: italic;
}

#todoapp input::-moz-placeholder {
	font-style: italic;
	color: #a9a9a9;
}

#todoapp h1 {
	position: absolute;
	top: -120px;
	width: 100%;
	font-size: 70px;
	font-weight: bold;
	text-align: center;
	color: #b3b3b3;
	color: rgba(255, 255, 255, 0.3);
	text-shadow: -1px -1px rgba(0, 0, 0, 0.2);
	-webkit-text-rendering: optimizeLegibility;
	-moz-text-rendering: optimizeLegibility;
	-ms-text-rendering: optimizeLegibility;
	-o-text-rendering: optimizeLegibility;
	text-rendering: optimizeLegibility;
}

#header {
	padding-top: 15px;
	border-radius: inherit;
}

#header:before {
	content: '';
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	height: 15px;
	z-index: 2;
	border-bottom: 1px solid #6c615c;
	background: #8d7d77;
	background: -webkit-gradient(linear, left top, left bottom, from(rgba(132, 110, 100, 0.8)),to(rgba(101, 84, 76, 0.8)));
	background: -webkit-linear-gradient(top, rgba(132, 110, 100, 0.8), rgba(101, 84, 76, 0.8));
	background: linear-gradient(top, rgba(132, 110, 100, 0.8), rgba(101, 84, 76, 0.8));
	filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0,StartColorStr='#9d8b83', EndColorStr='#847670');
	border-top-left-radius: 1px;
	border-top-right-radius: 1px;
}

#new-todo,
.edit {
	position: relative;
	margin: 0;
	width: 100%;
	font-size: 24px;
	font-family: inherit;
	line-height: 1.4em;
	border: 0;
	outline: none;
	color: inherit;
	padding: 6px;
	border: 1px solid #999;
	box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
	-moz-box-sizing: border-box;
	-ms-box-sizing: border-box;
	-o-box-sizing: border-box;
	box-sizing: border-box;
	-webkit-font-smoothing: antialiased;
	-moz-font-smoothing: antialiased;
	-ms-font-smoothing: antialiased;
	-o-font-smoothing: antialiased;
	font-smoothing: antialiased;
}

#new-todo {
	padding: 16px 16px 16px 60px;
	border: none;
	background: rgba(0, 0, 0, 0.02);
	z-index: 2;
	box-shadow: none;
}

#main {
	position: relative;
	z-index: 2;
	border-top: 1px dotted #adadad;
}

label[for='toggle-all'] {
	display: none;
}

#toggle-all {
	position: absolute;
	top: -42px;
	left: -4px;
	width: 40px;
	text-align: center;
	/* Mobile Safari */
	border: none;
}

#toggle-all:before {
	content: '»';
	font-size: 28px;
	color: #d9d9d9;
	padding: 0 25px 7px;
}

#toggle-all:checked:before {
	color: #737373;
}

#todo-list {
	margin: 0;
	padding: 0;
	list-style: none;
}

#todo-list li {
	position: relative;
	font-size: 24px;
	border-bottom: 1px dotted #ccc;
}

#todo-list li:last-child {
	border-bottom: none;
}

#todo-list li.editing {
	border-bottom: none;
	padding: 0;
}

#todo-list li.editing .edit {
	display: block;
	width: 506px;
	padding: 13px 17px 12px 17px;
	margin: 0 0 0 43px;
}

#todo-list li.editing .view {
	display: none;
}

#todo-list li .toggle {
	text-align: center;
	width: 40px;
	/* auto, since non-WebKit browsers doesn't support input styling */
	height: auto;
	position: absolute;
	top: 0;
	bottom: 0;
	margin: auto 0;
	/* Mobile Safari */
	border: none;
	-webkit-appearance: none;
	-ms-appearance: none;
	-o-appearance: none;
	appearance: none;
}

#todo-list li .toggle:after {
	content: '✔';
	/* 40 + a couple of pixels visual adjustment */
	line-height: 43px;
	font-size: 20px;
	color: #d9d9d9;
	text-shadow: 0 -1px 0 #bfbfbf;
}

#todo-list li .toggle:checked:after {
	color: #85ada7;
	text-shadow: 0 1px 0 #669991;
	bottom: 1px;
	position: relative;
}

#todo-list li label {
	white-space: pre;
	word-break: break-word;
	padding: 15px 60px 15px 15px;
	margin-left: 45px;
	display: block;
	line-height: 1.2;
	-webkit-transition: color 0.4s;
	transition: color 0.4s;
}

#todo-list li.completed label {
	color: #a9a9a9;
	text-decoration: line-through;
}

#todo-list li .destroy {
	display: none;
	position: absolute;
	top: 0;
	right: 10px;
	bottom: 0;
	width: 40px;
	height: 40px;
	margin: auto 0;
	font-size: 22px;
	color: #a88a8a;
	-webkit-transition: all 0.2s;
	transition: all 0.2s;
}

#todo-list li .destroy:hover {
	text-shadow: 0 0 1px #000,
				 0 0 10px rgba(199, 107, 107, 0.8);
	-webkit-transform: scale(1.3);
	transform: scale(1.3);
}

#todo-list li .destroy:after {
	content: '✖';
}

#todo-list li:hover .destroy {
	display: block;
}

#todo-list li .edit {
	display: none;
}

#todo-list li.editing:last-child {
	margin-bottom: -1px;
}

#footer {
	color: #777;
	padding: 0 15px;
	position: absolute;
	right: 0;
	bottom: -31px;
	left: 0;
	height: 20px;
	z-index: 1;
	text-align: center;
}

#footer:before {
	content: '';
	position: absolute;
	right: 0;
	bottom: 31px;
	left: 0;
	height: 50px;
	z-index: -1;
	box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3),
				0 6px 0 -3px rgba(255, 255, 255, 0.8),
				0 7px 1px -3px rgba(0, 0, 0, 0.3),
				0 43px 0 -6px rgba(255, 255, 255, 0.8),
				0 44px 2px -6px rgba(0, 0, 0, 0.2);
}

#todo-count {
	float: left;
	text-align: left;
}

#filters {
	margin: 0;
	padding: 0;
	list-style: none;
	position: absolute;
	right: 0;
	left: 0;
}

#filters li {
	display: inline;
}

#filters li a {
	color: #83756f;
	margin: 2px;
	text-decoration: none;
}

#filters li a.selected {
	font-weight: bold;
}

#clear-completed {
	float: right;
	position: relative;
	line-height: 20px;
	text-decoration: none;
	background: rgba(0, 0, 0, 0.1);
	font-size: 11px;
	padding: 0 10px;
	border-radius: 3px;
	box-shadow: 0 -1px 0 0 rgba(0, 0, 0, 0.2);
}

#clear-completed:hover {
	background: rgba(0, 0, 0, 0.15);
	box-shadow: 0 -1px 0 0 rgba(0, 0, 0, 0.3);
}

#info {
	margin: 65px auto 0;
	color: #a6a6a6;
	font-size: 12px;
	text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
	text-align: center;
}

#info a {
	color: inherit;
}

/*
	Hack to remove background from Mobile Safari.
	Can't use it globally since it destroys checkboxes in Firefox and Opera
*/

@media screen and (-webkit-min-device-pixel-ratio:0) {
	#toggle-all,
	#todo-list li .toggle {
		background: none;
	}

	#todo-list li .toggle {
		height: 40px;
	}

	#toggle-all {
		top: -56px;
		left: -15px;
		width: 65px;
		height: 41px;
		-webkit-transform: rotate(90deg);
		transform: rotate(90deg);
		-webkit-appearance: none;
		appearance: none;
	}
}

.hidden {
	display: none;
}

hr {
	margin: 20px 0;
	border: 0;
	border-top: 1px dashed #C5C5C5;
	border-bottom: 1px dashed #F7F7F7;
}

.learn a {
	font-weight: normal;
	text-decoration: none;
	color: #b83f45;
}

.learn a:hover {
	text-decoration: underline;
	color: #787e7e;
}

.learn h3,
.learn h4,
.learn h5 {
	margin: 10px 0;
	font-weight: 500;
	line-height: 1.2;
	color: #000;
}

.learn h3 {
	font-size: 24px;
}

.learn h4 {
	font-size: 18px;
}

.learn h5 {
	margin-bottom: 0;
	font-size: 14px;
}

.learn ul {
	padding: 0;
	margin: 0 0 30px 25px;
}

.learn li {
	line-height: 20px;
}

.learn p {
	font-size: 15px;
	font-weight: 300;
	line-height: 1.3;
	margin-top: 0;
	margin-bottom: 0;
}

.quote {
	border: none;
	margin: 20px 0 60px 0;
}

.quote p {
	font-style: italic;
}

.quote p:before {
	content: '“';
	font-size: 50px;
	opacity: .15;
	position: absolute;
	top: -20px;
	left: 3px;
}

.quote p:after {
	content: '”';
	font-size: 50px;
	opacity: .15;
	position: absolute;
	bottom: -42px;
	right: 3px;
}

.quote footer {
	position: absolute;
	bottom: -40px;
	right: 0;
}

.quote footer img {
	border-radius: 3px;
}

.quote footer a {
	margin-left: 5px;
	vertical-align: middle;
}

.speech-bubble {
	position: relative;
	padding: 10px;
	background: rgba(0, 0, 0, .04);
	border-radius: 5px;
}

.speech-bubble:after {
	content: '';
	position: absolute;
	top: 100%;
	right: 30px;
	border: 13px solid transparent;
	border-top-color: rgba(0, 0, 0, .04);
}

.learn-bar > .learn {
	position: absolute;
	width: 272px;
	top: 8px;
	left: -300px;
	padding: 10px;
	border-radius: 5px;
	background-color: rgba(255, 255, 255, .6);
	-webkit-transition-property: left;
	transition-property: left;
	-webkit-transition-duration: 500ms;
	transition-duration: 500ms;
}

@media (min-width: 899px) {
	.learn-bar {
		width: auto;
		margin: 0 0 0 300px;
	}

	.learn-bar > .learn {
		left: 8px;
	}

	.learn-bar #todoapp {
		width: 550px;
		margin: 130px auto 40px auto;
	}
}
`)
