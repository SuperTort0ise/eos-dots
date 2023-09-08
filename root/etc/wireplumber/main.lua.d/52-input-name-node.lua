rule = {
  matches = {
    {
      { "node.name", "equals", "alsa_input.pci-0000_0f_00.4.analog-stereo" },
    },
  },
  apply_properties = {
    ["node.description"] = "System-In",
    ["node.nick"] = "System-In",
  },
}

table.insert(alsa_monitor.rules, rule)
