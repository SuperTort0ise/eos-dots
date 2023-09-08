rule = {
  matches = {
    {
      { "node.name", "equals", "alsa_output.pci-0000_0d_00.1.hdmi-stereo" },
    },
  },
  apply_properties = {
    ["node.description"] = "2070S-Out",
    ["node.nick"] = "2070S-Out",
  },
}

table.insert(alsa_monitor.rules, rule)
