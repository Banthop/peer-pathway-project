# Uthman — Speaker Sourcing Setup

Hey Uthman, follow these steps to get the AI sourcer running on your laptop. Should take 10 min.

---

## Step 1: Get the code

Open Terminal (search "Terminal" in Spotlight) and run:

```bash
cd ~/Desktop
git clone https://github.com/dongraham/peer-pathway-project.git
cd peer-pathway-project/scripts/speaker-sourcing
```

If you already have the repo, just pull the latest:

```bash
cd ~/Desktop/peer-pathway-project
git pull
cd scripts/speaker-sourcing
```

---

## Step 2: Add the API key

Don will send you an API key that looks like `sk-ant-api03-...`

Run this in Terminal (paste the real key Don sends you):

```bash
echo 'export ANTHROPIC_API_KEY="sk-ant-PASTE-YOUR-KEY-HERE"' >> ~/.zshrc
source ~/.zshrc
```

To check it worked:

```bash
echo $ANTHROPIC_API_KEY
```

It should print the key back.

---

## Step 3: Install dependencies

```bash
cd ~/Desktop/peer-pathway-project/scripts/speaker-sourcing
chmod +x setup.sh run.sh
./setup.sh
```

This installs the Python packages. Takes ~30 seconds.

---

## Step 4: You're done. Run it.

```bash
./run.sh
```

That's it. Here's what happens:

1. Shows you the dashboard (who's confirmed, what gaps exist)
2. Asks if you want to start sourcing — press `y`
3. Chrome opens and goes to LinkedIn Sales Navigator
4. **Log in to LinkedIn when it asks** — then sit back
5. AI searches through 17 different filters automatically (Goldman, JPMorgan, women in IB, dark horses, etc.)
6. Takes 30-60 min — you can do other stuff
7. When done, it scores everyone and gives you copy-paste DMs

---

## Daily Routine (30 min)

### Morning

```bash
cd ~/Desktop/peer-pathway-project/scripts/speaker-sourcing
./run.sh
```

### After sending DMs

When you've sent a DM to someone on LinkedIn:

```bash
python3 04_attio_sync.py --advance "TheirName" "DM Sent"
```

When they reply:

```bash
python3 04_attio_sync.py --advance "TheirName" "Replied"
```

When they confirm they'll be on the panel:

```bash
python3 04_attio_sync.py --advance "TheirName" "Confirmed"
```

### Quick status check (no sourcing)

```bash
./run.sh quick
```

### Just generate DMs

```bash
./run.sh dm
```

---

## If something goes wrong

| Problem | Fix |
|---------|-----|
| "ANTHROPIC_API_KEY not set" | Run `source ~/.zshrc` and try again |
| Browser doesn't open | Run `pip3 install browser-use` and try again |
| LinkedIn blocks the searches | Wait 24 hours. Next time run `python3 01_linkedin_sourcer.py --max-searches 5` |
| Script crashes halfway | Just run `./run.sh` again — it picks up where it left off |
| Anything else | Screenshot the error and send to Don |

---

## What you're looking for

Priority order:
1. **Gap firms** — Goldman, JPMorgan, Deutsche Bank, Rothschild, Lazard, Evercore, BNP, KPMG, Jane Street, BlackRock, Pimco
2. **Women** — panel is male-heavy, we need more female speakers
3. **People with conversions** — turned spring week into return offer or summer internship
4. **Dark horses** — non-LSE students who got top spring weeks (Exeter, Bath, Durham etc.)
5. **Sector coverage** — we still need Law and Tech

The scripts handle all the scoring and prioritising for you. Just run them, copy the DMs, and send.
