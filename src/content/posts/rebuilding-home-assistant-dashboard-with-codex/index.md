---
title: "The Home Assistant dashboard I finally rebuilt"
description: "My smart home worked. Its dashboard showed too much at once. Working with Codex in the browser, I rebuilt it around rooms rather than devices — and finally finished a job I had been putting off."
slug: rebuilding-home-assistant-dashboard-with-codex
pubDate: 2026-10-23
readingMinutes: 8
thumbnail:
  src: ./thumbnail.png
  alt: Room cards opening a detailed dashboard panel.
tags:
  - Home Assistant
  - AI
  - Codex
  - Home Automation
---

My Home Assistant dashboard had everything I needed. Unfortunately, it showed almost all of it at once. It was technically correct, built around the equipment I had integrated, and perfectly understandable if you happened to be the person who configured it. I was that person, and even I was getting tired of looking at it.

I had been meaning to rebuild it for a long time. A few attempts ended with a collection of promising cards, some AI recommendations and the same uncomfortable thought: somebody still had to reorganise every room and rewrite every little piece of the interface. I expected several days of manual effort. The existing dashboard worked, so postponing the job was easy.

Eventually, I opened Home Assistant in **Codex's built-in browser** and let the agent work on the actual dashboard with me. After about five hours of work, by my estimate, I had the replacement I now use every day, with surprisingly little of the repetitive editing that had put me off starting.

## How my house ended up on one very crowded screen

My goal with Home Assistant has always been to integrate everything in the house that can reasonably be integrated. Lights, shutters, heating, the alarm, cameras, gates, appliances and energy monitoring all end up there. It is my own BMS — building management system — with hundreds of entities serving very different purposes.

Putting those systems together had already solved one problem: I could see and operate them in one place instead of treating every integration as a separate island. The dashboard had simply inherited too much of the machinery underneath. Each new device brought more controls and measurements, and I kept finding space for them. Eventually, checking a room meant scanning a small inventory of its equipment.

![Two room cards from the old dashboard.](images/en/01-before-components.png)

*The old approach: useful controls, but little distinction between what mattered now and what was merely available.*

What I wanted was a different way of using the same system. The first screen should tell me what needed attention and provide the actions I used most. A room should open into its everyday controls, with occasional functions still accessible underneath. I did not need to rebuild the house's automations to achieve that; I needed to stop exposing their entire vocabulary on the home screen.

## Giving AI access to the work, not just the question

I had used AI for dashboard advice before, but fitting the recommended cards to my rooms remained my job. This time I opened the existing installation in Codex's built-in browser, explained what I had and what I wanted, and asked the agent to work through it with me.

The agent could inspect the interface, use the dashboard editor, make changes and look at the result. There was still YAML involved, but I no longer had to copy every suggestion between the conversation and Home Assistant. I could review the screen and say what was wrong while Codex handled the next edit. This used my existing signed-in session; I did not expose Home Assistant publicly to make the experiment work.

We kept the old dashboard and created a separate **Test** dashboard for the replacement. That gave us a working reference and made it easy to reject a proposal without worrying about having overwritten the original.

## One room first, then the house

We started with the living room. My initial priorities were lights, shutters and temperature, and the first proposal arranged them into clear functional groups. It was a better room page, but I could immediately see the next problem: repeating it for every room would produce another oversized dashboard.

![The first living-room proposal.](images/en/02-first-room-prototype.png)

*A sensible first proposal, until I imagined repeating it across the whole house.*

That prompted the more useful requirement below. The quoted requests are translated from our Polish conversation and lightly edited for readability.

> “The living room is only one of many rooms. How do we fit all of them on this dashboard? Don't be afraid to use additional cards. I want something modern and light, perhaps a panel opening from another panel, like in a modern application.”

We moved towards compact room cards opening a room panel, with less frequent functions behind **More**. Mushroom and Bubble Card provided the building blocks. The important change was the navigation model: **house → room → details**. Instead of searching through devices, I could choose a room and reach the controls in context.

![An early living-room panel.](images/en/04-room-popup.png)

*The room panel became the reusable pattern. In this early version the television was still under More; I moved it forward later.*

Before spreading the pattern, I could decide what belonged on each level. The TV needed to be visible in the living room; the laundry needed its washer and dryer; bathrooms needed humidity and heating controls. Those differences did not prevent consistency, provided familiar functions stayed in predictable places.

> “Keep the module order consistent between rooms. If a type of control is on the main panel in one room, don't arbitrarily hide its equivalent in another. If you're unsure where it belongs, ask.”

Once the pattern was agreed, applying it across the house was exactly the repetitive work I had wanted help with.

## What the first attempt got wrong

Some iterations made things worse: cards became too tall, readings wrapped awkwardly, or controls ended up one level too deep. Having the actual page in front of the agent let me give direct feedback: keep these cards the same height, move this control forward, remove that duplicate. I could also ask it to wait while I collected several comments before starting the next edit.

A few corrections required knowledge of the house. The bathroom's night light should remain controllable without counting as a light someone had left on, and it should be excluded from the global light-off action. AI could inspect its entity, but I still needed to explain that role. Once explained, the same decision could be applied to the room summary, room controls and shared action without me editing each separately.

Gate icons were another useful refinement. A control switch sends an impulse; it does not tell you whether the gate is still open. I asked for the icons to follow the contact sensors instead, so the same opening showed the same physical state wherever it appeared. It was a small change, but a recognisable open-door symbol was more useful than another generic button with an “Off” label.

There were ordinary implementation problems too. A new TV panel did not work, and some energy readings disagreed with the old dashboard. Codex could inspect the existing entities and working cards, so I pointed it back to those implementations rather than describing every detail myself. Reusing working behaviour was much more productive than inventing a replacement simply because we were changing the layout.

## A dashboard organised around using the house

As the rooms came together, the front page became simpler. Active appliances could tell me that the dryer was running and how long remained, without opening the laundry. Room cards showed a compact summary, including total power where readings were available, while individual measurements stayed in the details. Common actions were grouped together, and exceptions appeared when relevant instead of occupying permanent space.

![Selected components from the later dashboard.](images/en/06-after-components.png)

*Active work, common actions and room summaries. These are selected components from across the house, rather than the entire page.*

We also removed things. A separate clock added little, duplicated readings did not need another card, and global shutter controls fitted under one choice instead of two permanent buttons. The aim was to make the first screen easier to understand while keeping the rest within reach. Room order, labels and icons mattered because they made that structure predictable, not because every element needed an elaborate design exercise.

The practices that helped were simple: preserve the working dashboard, establish one room pattern, reuse existing controls and review the rendered result before scaling it. Global actions kept their scope and confirmations; changing the interface should not quietly change which devices a command operates.

## What actually saved the time

The saving came from shortening the loop between a decision and something I could review. Previously, asking AI for advice still left me with hours of implementation before I knew whether I liked the idea. With Codex working through the built-in browser, a correction could become the next visible version, then become a rule applied to the remaining rooms.

I still had to explain what mattered and reject the wrong assumptions. That was a much smaller and more enjoyable job than manually rebuilding every card. The manual-work estimate was not a measured comparison, but about five hours of this collaboration was enough to put the new dashboard into daily use. More importantly, I finally finished the job I had kept finding reasons not to start.

*Illustrations recreate selected dashboard components with machine-translated English labels and illustrative readings.*
