const Main = imports.ui.main;
const Mainloop = imports.mainloop;

const St = imports.gi.St;
const Lang = imports.lang;
const PanelMenu = imports.ui.panelMenu;
const Clutter = imports.gi.Clutter;
const GLib = imports.gi.GLib;
const ShellToolkit = imports.gi.St;

const refreshTime = 3.0; // Set refresh time to three second.
let container, timeout, apName, defaultAccessPointName;

function getAccessPointName() {
  var command_output_bytes = GLib.spawn_command_line_sync('iwgetid -r')[1];
  var command_output_string = '';

  for (
    var current_character_index = 0;
    current_character_index < command_output_bytes.length;
    ++current_character_index
  ) {
    var current_character = String.fromCharCode(
      command_output_bytes[current_character_index]
    );
    command_output_string += current_character;
  }

  return command_output_string;
}

function updateAccessPointName() {
  const name = getAccessPointName();
  if (name !== '') {
    apName.set_text(`🌍 ${name}`);
  } else {
    apName.set_text(defaultAccessPointName);
  }
  return true;
}

function init() {
  log('Access Point Name extension initialized');
}

function enable() {
  log('Access Point Name extension enabled');
  container = new St.Bin({
    style_class: 'panel-button',
    reactive: true,
    can_focus: false,
    x_expand: true,
    y_expand: false,
    track_hover: false,
  });
  defaultAccessPointName = '[---]';
  apName = new St.Label({
    text: defaultAccessPointName,
    style_class: 'apNameLabel',
    y_align: Clutter.ActorAlign.CENTER,
  });
  container.set_child(apName);
  Main.panel._rightBox.insert_child_at_index(container, 0);
  timeout = Mainloop.timeout_add_seconds(refreshTime, updateAccessPointName);
}

function disable() {
  log('Access Point Name extension disabled');
  Mainloop.source_remove(timeout);
  Main.panel._rightBox.remove_child(container);
  container.destroy();
  apName.destroy();
  container = null;
  apName = null;
  defaultAccessPointName = null;
  timeout = null;
}
