rule = {
  matches = {
    {
      { "node.name", "equals", "alsa_output.pci-0000_0f_00.4.analog-stereo" },
    },
  },
  apply_properties = {
    ["node.description"] = "System-Out",
    ["node.nick"] = "System-Out",
  },
}

table.insert(alsa_monitor.rules, rule)
