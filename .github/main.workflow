workflow "New workflow" {
  on = "push"
  resolves = ["nuxt/actions-yarn@node-10"]
}

action "nuxt/actions-yarn@node-10" {
  uses = "nuxt/actions-yarn@node-10"
  args = "install"
}
