---
setup: |
  import Layout from '../../layouts/BlogPost.astro'
  import Components from '../../components'
  const { Author } = Components
title: Hello world!
publishDate: 12 Sep 2021
author: Marc Redwerkz
authorURL: https://github.com/rdwz
value: 128
description: Just a Hello World Post!
---

<Author name="Nate Moore" href="https://twitter.com/redwerkz" />

This is so cool!

Do variables work {frontmatter.value * 2}?
