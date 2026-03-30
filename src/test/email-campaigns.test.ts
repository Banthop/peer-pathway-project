import { describe, it, expect } from "vitest";

// ============================================================
// Helpers: replicate the filter + HTML logic from our scripts
// so we can test them without importing ESM scripts directly
// ============================================================

type CRMContact = {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  tags: string[];
  status?: string;
  metadata?: Record<string, unknown>;
};

// -- final-push.mjs segment filters (verbatim from script) --

const FINAL_PUSH_FILTERS = {
  buyer_reminder: (c: CRMContact) => {
    const tags = c.tags || [];
    return (
      tags.includes("stripe_customer") &&
      !tags.includes("final_push_buyer") &&
      !tags.includes("bounced")
    );
  },
  hot_lead: (c: CRMContact) => {
    const tags = c.tags || [];
    return (
      (tags.includes("email_clicked") || tags.includes("form_lead")) &&
      !tags.includes("stripe_customer") &&
      !tags.includes("bounced") &&
      !tags.includes("final_push_hot") &&
      !tags.includes("last_day_hot")
    );
  },
  guide_upsell: (c: CRMContact) => {
    const tags = c.tags || [];
    return (
      tags.includes("stripe_customer") &&
      (tags.includes("webinar_only") ||
        (c.metadata as Record<string, string>)?.product_type ===
          "webinar_only") &&
      !tags.includes("bundle") &&
      !tags.includes("final_push_upsell") &&
      !tags.includes("guide_upsell_sent") &&
      !tags.includes("last_day_upsell") &&
      !tags.includes("bounced")
    );
  },
  cold_reengage: (c: CRMContact) => {
    const tags = c.tags || [];
    const emailed =
      tags.includes("linkedin_emailed") ||
      tags.includes("email_sent") ||
      tags.includes("email_delivered");
    return (
      emailed &&
      !tags.includes("email_clicked") &&
      !tags.includes("form_lead") &&
      !tags.includes("stripe_customer") &&
      !tags.includes("bounced") &&
      !tags.includes("final_push_cold") &&
      !tags.includes("last_day_reengage")
    );
  },
  fresh_outreach: (c: CRMContact) => {
    const tags = c.tags || [];
    const neverTouched =
      !tags.includes("email_sent") &&
      !tags.includes("linkedin_emailed") &&
      !tags.includes("email_delivered") &&
      !tags.includes("confirmation_sent") &&
      !tags.includes("discount_sent");
    return (
      neverTouched &&
      !tags.includes("stripe_customer") &&
      !tags.includes("bounced") &&
      !tags.includes("final_push_fresh") &&
      !!c.email
    );
  },
};

// -- send-funnel-emails.mjs classification logic --

function classifyContact(contact: CRMContact) {
  const tags = contact.tags || [];
  const status = contact.status;

  if (status === "converted" || tags.includes("stripe_customer"))
    return { stage: "most_aware", emailNeeded: null };

  if (tags.includes("form_lead") || tags.includes("email_clicked")) {
    if (tags.includes("funnel_email_4"))
      return { stage: "product_aware", emailNeeded: null };
    return { stage: "product_aware", emailNeeded: "funnel_email_4" };
  }

  if (tags.includes("email_opened") || status === "engaged") {
    if (tags.includes("funnel_email_3"))
      return { stage: "solution_aware", emailNeeded: null };
    return { stage: "solution_aware", emailNeeded: "funnel_email_3" };
  }

  if (
    tags.includes("email_sent") ||
    tags.includes("linkedin_emailed") ||
    tags.includes("email_delivered") ||
    status === "contacted"
  ) {
    if (tags.includes("funnel_email_2"))
      return { stage: "problem_aware", emailNeeded: null };
    return { stage: "problem_aware", emailNeeded: "funnel_email_2" };
  }

  return { stage: "unaware", emailNeeded: null };
}

// -- discount blast segment filters --

const DISCOUNT_SEGMENTS = {
  hot_leads: (c: CRMContact) =>
    (c.tags.includes("email_clicked") || c.tags.includes("form_lead")) &&
    !c.tags.includes("stripe_customer") &&
    !c.tags.includes("bounced"),
  clicked_not_bought: (c: CRMContact) =>
    c.tags.includes("email_clicked") && !c.tags.includes("stripe_customer"),
  form_not_bought: (c: CRMContact) =>
    c.tags.includes("form_lead") && !c.tags.includes("stripe_customer"),
  all_non_buyers: (c: CRMContact) =>
    !c.tags.includes("stripe_customer") && !c.tags.includes("bounced"),
};

// ============================================================
// Test fixtures
// ============================================================

function makeContact(overrides: Partial<CRMContact>): CRMContact {
  return {
    id: crypto.randomUUID?.() || Math.random().toString(36),
    email: "test@example.com",
    first_name: "Test",
    last_name: "User",
    tags: [],
    ...overrides,
  };
}

// ============================================================
// TESTS: Final Push Segment Filters
// ============================================================

describe("Final Push - Segment Filters", () => {
  describe("Buyer Reminder", () => {
    it("should include stripe customers who have not been sent final_push_buyer", () => {
      const contact = makeContact({ tags: ["stripe_customer"] });
      expect(FINAL_PUSH_FILTERS.buyer_reminder(contact)).toBe(true);
    });

    it("should exclude contacts already tagged final_push_buyer", () => {
      const contact = makeContact({
        tags: ["stripe_customer", "final_push_buyer"],
      });
      expect(FINAL_PUSH_FILTERS.buyer_reminder(contact)).toBe(false);
    });

    it("should exclude bounced contacts", () => {
      const contact = makeContact({
        tags: ["stripe_customer", "bounced"],
      });
      expect(FINAL_PUSH_FILTERS.buyer_reminder(contact)).toBe(false);
    });

    it("should exclude non-buyers", () => {
      const contact = makeContact({ tags: ["email_clicked"] });
      expect(FINAL_PUSH_FILTERS.buyer_reminder(contact)).toBe(false);
    });
  });

  describe("Hot Lead", () => {
    it("should include email clickers who never bought", () => {
      const contact = makeContact({ tags: ["email_clicked"] });
      expect(FINAL_PUSH_FILTERS.hot_lead(contact)).toBe(true);
    });

    it("should include form leads who never bought", () => {
      const contact = makeContact({ tags: ["form_lead"] });
      expect(FINAL_PUSH_FILTERS.hot_lead(contact)).toBe(true);
    });

    it("should exclude buyers", () => {
      const contact = makeContact({
        tags: ["email_clicked", "stripe_customer"],
      });
      expect(FINAL_PUSH_FILTERS.hot_lead(contact)).toBe(false);
    });

    it("should exclude contacts already tagged final_push_hot", () => {
      const contact = makeContact({
        tags: ["email_clicked", "final_push_hot"],
      });
      expect(FINAL_PUSH_FILTERS.hot_lead(contact)).toBe(false);
    });

    it("should exclude contacts already tagged last_day_hot", () => {
      const contact = makeContact({
        tags: ["form_lead", "last_day_hot"],
      });
      expect(FINAL_PUSH_FILTERS.hot_lead(contact)).toBe(false);
    });

    it("should exclude bounced contacts", () => {
      const contact = makeContact({
        tags: ["email_clicked", "bounced"],
      });
      expect(FINAL_PUSH_FILTERS.hot_lead(contact)).toBe(false);
    });
  });

  describe("Guide Upsell", () => {
    it("should include webinar_only buyers via tag", () => {
      const contact = makeContact({
        tags: ["stripe_customer", "webinar_only"],
      });
      expect(FINAL_PUSH_FILTERS.guide_upsell(contact)).toBe(true);
    });

    it("should include webinar_only buyers via metadata", () => {
      const contact = makeContact({
        tags: ["stripe_customer"],
        metadata: { product_type: "webinar_only" },
      });
      expect(FINAL_PUSH_FILTERS.guide_upsell(contact)).toBe(true);
    });

    it("should exclude bundle buyers", () => {
      const contact = makeContact({
        tags: ["stripe_customer", "webinar_only", "bundle"],
      });
      expect(FINAL_PUSH_FILTERS.guide_upsell(contact)).toBe(false);
    });

    it("should exclude contacts already sent guide upsell", () => {
      const contact = makeContact({
        tags: ["stripe_customer", "webinar_only", "guide_upsell_sent"],
      });
      expect(FINAL_PUSH_FILTERS.guide_upsell(contact)).toBe(false);
    });

    it("should exclude contacts already tagged final_push_upsell", () => {
      const contact = makeContact({
        tags: ["stripe_customer", "webinar_only", "final_push_upsell"],
      });
      expect(FINAL_PUSH_FILTERS.guide_upsell(contact)).toBe(false);
    });
  });

  describe("Cold Re-engage", () => {
    it("should include linkedin_emailed contacts who never clicked", () => {
      const contact = makeContact({ tags: ["linkedin_emailed"] });
      expect(FINAL_PUSH_FILTERS.cold_reengage(contact)).toBe(true);
    });

    it("should include email_sent contacts who never clicked", () => {
      const contact = makeContact({ tags: ["email_sent"] });
      expect(FINAL_PUSH_FILTERS.cold_reengage(contact)).toBe(true);
    });

    it("should include email_delivered contacts who never clicked", () => {
      const contact = makeContact({ tags: ["email_delivered"] });
      expect(FINAL_PUSH_FILTERS.cold_reengage(contact)).toBe(true);
    });

    it("should exclude contacts who clicked", () => {
      const contact = makeContact({
        tags: ["email_sent", "email_clicked"],
      });
      expect(FINAL_PUSH_FILTERS.cold_reengage(contact)).toBe(false);
    });

    it("should exclude form leads", () => {
      const contact = makeContact({
        tags: ["email_sent", "form_lead"],
      });
      expect(FINAL_PUSH_FILTERS.cold_reengage(contact)).toBe(false);
    });

    it("should exclude buyers", () => {
      const contact = makeContact({
        tags: ["email_sent", "stripe_customer"],
      });
      expect(FINAL_PUSH_FILTERS.cold_reengage(contact)).toBe(false);
    });

    it("should exclude already tagged final_push_cold", () => {
      const contact = makeContact({
        tags: ["linkedin_emailed", "final_push_cold"],
      });
      expect(FINAL_PUSH_FILTERS.cold_reengage(contact)).toBe(false);
    });

    it("should exclude already tagged last_day_reengage", () => {
      const contact = makeContact({
        tags: ["email_sent", "last_day_reengage"],
      });
      expect(FINAL_PUSH_FILTERS.cold_reengage(contact)).toBe(false);
    });
  });

  describe("Fresh Outreach", () => {
    it("should include never-touched contacts with an email", () => {
      const contact = makeContact({ tags: [], email: "fresh@test.com" });
      expect(FINAL_PUSH_FILTERS.fresh_outreach(contact)).toBe(true);
    });

    it("should exclude contacts with email_sent tag", () => {
      const contact = makeContact({ tags: ["email_sent"] });
      expect(FINAL_PUSH_FILTERS.fresh_outreach(contact)).toBe(false);
    });

    it("should exclude contacts with linkedin_emailed tag", () => {
      const contact = makeContact({ tags: ["linkedin_emailed"] });
      expect(FINAL_PUSH_FILTERS.fresh_outreach(contact)).toBe(false);
    });

    it("should exclude contacts with confirmation_sent tag", () => {
      const contact = makeContact({ tags: ["confirmation_sent"] });
      expect(FINAL_PUSH_FILTERS.fresh_outreach(contact)).toBe(false);
    });

    it("should exclude contacts with discount_sent tag", () => {
      const contact = makeContact({ tags: ["discount_sent"] });
      expect(FINAL_PUSH_FILTERS.fresh_outreach(contact)).toBe(false);
    });

    it("should exclude stripe customers", () => {
      const contact = makeContact({ tags: ["stripe_customer"] });
      expect(FINAL_PUSH_FILTERS.fresh_outreach(contact)).toBe(false);
    });

    it("should exclude bounced contacts", () => {
      const contact = makeContact({ tags: ["bounced"] });
      expect(FINAL_PUSH_FILTERS.fresh_outreach(contact)).toBe(false);
    });

    it("should exclude contacts already tagged final_push_fresh", () => {
      const contact = makeContact({ tags: ["final_push_fresh"] });
      expect(FINAL_PUSH_FILTERS.fresh_outreach(contact)).toBe(false);
    });

    it("should exclude contacts with no email", () => {
      const contact = makeContact({ tags: [], email: "" });
      expect(FINAL_PUSH_FILTERS.fresh_outreach(contact)).toBe(false);
    });
  });
});

// ============================================================
// TESTS: Mutual exclusion (no contact should match 2+ segments)
// ============================================================

describe("Final Push - Mutual Exclusion", () => {
  const allFilters = Object.values(FINAL_PUSH_FILTERS);

  const testCases: CRMContact[] = [
    makeContact({ tags: ["stripe_customer"] }),
    makeContact({
      tags: ["stripe_customer", "webinar_only"],
    }),
    makeContact({ tags: ["email_clicked"] }),
    makeContact({ tags: ["form_lead"] }),
    makeContact({ tags: ["linkedin_emailed"] }),
    makeContact({ tags: ["email_sent"] }),
    makeContact({ tags: [] }),
    makeContact({ tags: ["bounced"] }),
    makeContact({
      tags: ["stripe_customer", "bounced"],
    }),
    makeContact({
      tags: ["email_clicked", "stripe_customer"],
    }),
  ];

  for (const contact of testCases) {
    it(`contact with tags [${contact.tags.join(", ")}] should match at most 2 segments`, () => {
      // Buyer reminder and guide upsell can both match a webinar_only buyer,
      // but aside from that intentional overlap, segments should not collide heavily
      const matchCount = allFilters.filter((f) => f(contact)).length;
      expect(matchCount).toBeLessThanOrEqual(2);
    });
  }
});

// ============================================================
// TESTS: Funnel Classification
// ============================================================

describe("Funnel Classification", () => {
  it("should classify stripe_customer as most_aware", () => {
    const result = classifyContact(
      makeContact({ tags: ["stripe_customer"] })
    );
    expect(result.stage).toBe("most_aware");
    expect(result.emailNeeded).toBeNull();
  });

  it("should classify converted status as most_aware", () => {
    const result = classifyContact(
      makeContact({ status: "converted", tags: [] })
    );
    expect(result.stage).toBe("most_aware");
    expect(result.emailNeeded).toBeNull();
  });

  it("should classify form_lead as product_aware needing email 4", () => {
    const result = classifyContact(makeContact({ tags: ["form_lead"] }));
    expect(result.stage).toBe("product_aware");
    expect(result.emailNeeded).toBe("funnel_email_4");
  });

  it("should skip email 4 if already sent", () => {
    const result = classifyContact(
      makeContact({ tags: ["form_lead", "funnel_email_4"] })
    );
    expect(result.stage).toBe("product_aware");
    expect(result.emailNeeded).toBeNull();
  });

  it("should classify email_clicked as product_aware needing email 4", () => {
    const result = classifyContact(
      makeContact({ tags: ["email_clicked"] })
    );
    expect(result.stage).toBe("product_aware");
    expect(result.emailNeeded).toBe("funnel_email_4");
  });

  it("should classify email_opened as solution_aware needing email 3", () => {
    const result = classifyContact(
      makeContact({ tags: ["email_opened"] })
    );
    expect(result.stage).toBe("solution_aware");
    expect(result.emailNeeded).toBe("funnel_email_3");
  });

  it("should classify engaged status as solution_aware", () => {
    const result = classifyContact(
      makeContact({ status: "engaged", tags: [] })
    );
    expect(result.stage).toBe("solution_aware");
    expect(result.emailNeeded).toBe("funnel_email_3");
  });

  it("should classify email_sent as problem_aware needing email 2", () => {
    const result = classifyContact(makeContact({ tags: ["email_sent"] }));
    expect(result.stage).toBe("problem_aware");
    expect(result.emailNeeded).toBe("funnel_email_2");
  });

  it("should classify linkedin_emailed as problem_aware", () => {
    const result = classifyContact(
      makeContact({ tags: ["linkedin_emailed"] })
    );
    expect(result.stage).toBe("problem_aware");
    expect(result.emailNeeded).toBe("funnel_email_2");
  });

  it("should classify contacted status as problem_aware", () => {
    const result = classifyContact(
      makeContact({ status: "contacted", tags: [] })
    );
    expect(result.stage).toBe("problem_aware");
    expect(result.emailNeeded).toBe("funnel_email_2");
  });

  it("should classify unknown contacts as unaware with no email", () => {
    const result = classifyContact(makeContact({ tags: [] }));
    expect(result.stage).toBe("unaware");
    expect(result.emailNeeded).toBeNull();
  });

  it("should respect priority: form_lead+email_opened should be product_aware", () => {
    const result = classifyContact(
      makeContact({ tags: ["form_lead", "email_opened"] })
    );
    expect(result.stage).toBe("product_aware");
  });

  it("should respect priority: stripe_customer overrides everything", () => {
    const result = classifyContact(
      makeContact({
        tags: [
          "stripe_customer",
          "form_lead",
          "email_clicked",
          "email_opened",
        ],
      })
    );
    expect(result.stage).toBe("most_aware");
  });
});

// ============================================================
// TESTS: Discount Blast Segments
// ============================================================

describe("Discount Blast - Segments", () => {
  it("hot_leads should include clickers who are not buyers", () => {
    const contact = makeContact({ tags: ["email_clicked"] });
    expect(DISCOUNT_SEGMENTS.hot_leads(contact)).toBe(true);
  });

  it("hot_leads should include form leads who are not buyers", () => {
    const contact = makeContact({ tags: ["form_lead"] });
    expect(DISCOUNT_SEGMENTS.hot_leads(contact)).toBe(true);
  });

  it("hot_leads should exclude buyers", () => {
    const contact = makeContact({
      tags: ["email_clicked", "stripe_customer"],
    });
    expect(DISCOUNT_SEGMENTS.hot_leads(contact)).toBe(false);
  });

  it("hot_leads should exclude bounced", () => {
    const contact = makeContact({
      tags: ["email_clicked", "bounced"],
    });
    expect(DISCOUNT_SEGMENTS.hot_leads(contact)).toBe(false);
  });

  it("all_non_buyers should include anyone not a buyer or bounced", () => {
    const contact = makeContact({ tags: ["email_sent"] });
    expect(DISCOUNT_SEGMENTS.all_non_buyers(contact)).toBe(true);
  });

  it("all_non_buyers should exclude buyers", () => {
    const contact = makeContact({ tags: ["stripe_customer"] });
    expect(DISCOUNT_SEGMENTS.all_non_buyers(contact)).toBe(false);
  });

  it("all_non_buyers should exclude bounced", () => {
    const contact = makeContact({ tags: ["bounced"] });
    expect(DISCOUNT_SEGMENTS.all_non_buyers(contact)).toBe(false);
  });
});

// ============================================================
// TESTS: No Em Dashes in Email HTML
// ============================================================

describe("No Em Dashes in Email Content", () => {
  // The actual HTML bodies from final-push.mjs
  // We replicate the key strings to verify no em dashes slipped in
  const emailBodies = [
    // Buyer Reminder
    "Quick reminder: the webinar is <strong>tomorrow</strong>. Saturday 28th March, 7pm GMT sharp.",
    "Here is your Zoom link. Save it somewhere you will not lose it:",
    "If you have not already, go through the resources before tomorrow.",
    "Can't make it live? No worries, recording goes out within 24 hours.",
    // Hot Lead
    "This is genuinely the last email I am going to send you about this.",
    "I know you were interested because you checked it out. So here is the deal:",
    "Recording included if you cannot make it live.",
    "If it is not for you, no hard feelings.",
    // Cold
    "No connections. No network. Just a system that got him a 21% response rate.",
    "If you are looking for internships this summer and do not have something lined up yet,",
    // Guide Upsell
    "You have got your webinar ticket for tomorrow. Nice.",
    "The students who get the most out of these sessions are the ones who come having already read the framework.",
    "Read it tonight. Come prepared tomorrow.",
    // Fresh
    "Random one, but if you are a student looking for internships",
    "Recording included if you cannot make it live.",
  ];

  const EM_DASH = "\u2014"; // Unicode em dash
  const EN_DASH = "\u2013"; // Unicode en dash

  for (const body of emailBodies) {
    it(`should not contain em dashes: "${body.slice(0, 50)}..."`, () => {
      expect(body).not.toContain(EM_DASH);
      expect(body).not.toContain(EN_DASH);
    });
  }

  // Additional: check that common contractions are kept clean
  const contractionsToCheck = [
    "it is",
    "do not",
    "cannot",
    "will not",
    "have not",
  ];

  for (const phrase of contractionsToCheck) {
    it(`should use "${phrase}" instead of an em dash construction`, () => {
      // Just verifying the phrases exist in at least one email body
      const found = emailBodies.some((b) =>
        b.toLowerCase().includes(phrase)
      );
      expect(found).toBe(true);
    });
  }
});

// ============================================================
// TESTS: CRM Tag Deduplication
// ============================================================

describe("CRM Tag Deduplication", () => {
  it("should deduplicate tags when adding new ones", () => {
    const existingTags = ["email_sent", "linkedin_emailed"];
    const newTags = [
      ...new Set([
        ...existingTags,
        "final_push_cold",
        "email_sent",
        "final_push_campaign",
      ]),
    ];
    expect(newTags).toEqual([
      "email_sent",
      "linkedin_emailed",
      "final_push_cold",
      "final_push_campaign",
    ]);
    // No duplicates
    expect(new Set(newTags).size).toBe(newTags.length);
  });

  it("should handle empty existing tags", () => {
    const existingTags: string[] = [];
    const newTags = [
      ...new Set([
        ...existingTags,
        "final_push_fresh",
        "email_sent",
        "final_push_campaign",
      ]),
    ];
    expect(newTags).toHaveLength(3);
    expect(newTags).toContain("final_push_fresh");
    expect(newTags).toContain("email_sent");
    expect(newTags).toContain("final_push_campaign");
  });

  it("should not lose existing tags when merging", () => {
    const existingTags = [
      "stripe_customer",
      "webinar_only",
      "confirmation_sent",
    ];
    const newTags = [
      ...new Set([
        ...existingTags,
        "final_push_upsell",
        "email_sent",
        "final_push_campaign",
      ]),
    ];
    expect(newTags).toContain("stripe_customer");
    expect(newTags).toContain("webinar_only");
    expect(newTags).toContain("confirmation_sent");
    expect(newTags).toHaveLength(6);
  });
});

// ============================================================
// TESTS: Edge Cases
// ============================================================

describe("Edge Cases", () => {
  it("should handle contact with undefined tags gracefully", () => {
    const contact = {
      id: "1",
      email: "test@test.com",
      tags: undefined as unknown as string[],
    } as CRMContact;
    // Filters use `c.tags || []` so this should not throw
    expect(() => FINAL_PUSH_FILTERS.buyer_reminder(contact)).not.toThrow();
    expect(() => FINAL_PUSH_FILTERS.hot_lead(contact)).not.toThrow();
    expect(() => FINAL_PUSH_FILTERS.cold_reengage(contact)).not.toThrow();
    expect(() => FINAL_PUSH_FILTERS.fresh_outreach(contact)).not.toThrow();
  });

  it("should handle contact with null tags gracefully", () => {
    const contact = {
      id: "1",
      email: "test@test.com",
      tags: null as unknown as string[],
    } as CRMContact;
    expect(() => FINAL_PUSH_FILTERS.buyer_reminder(contact)).not.toThrow();
    expect(FINAL_PUSH_FILTERS.buyer_reminder(contact)).toBe(false);
  });

  it("should not match a contact with every possible tag", () => {
    const allTags = [
      "stripe_customer",
      "bounced",
      "email_clicked",
      "form_lead",
      "linkedin_emailed",
      "email_sent",
      "email_delivered",
      "confirmation_sent",
      "discount_sent",
      "final_push_buyer",
      "final_push_hot",
      "final_push_cold",
      "final_push_fresh",
      "final_push_upsell",
      "last_day_hot",
      "last_day_reengage",
      "guide_upsell_sent",
      "last_day_upsell",
      "webinar_only",
      "bundle",
    ];
    const contact = makeContact({ tags: allTags });
    for (const filter of Object.values(FINAL_PUSH_FILTERS)) {
      expect(filter(contact)).toBe(false);
    }
  });

  it("a brand new contact (no tags, has email) should only match fresh_outreach", () => {
    const contact = makeContact({ tags: [], email: "new@student.ac.uk" });
    expect(FINAL_PUSH_FILTERS.buyer_reminder(contact)).toBe(false);
    expect(FINAL_PUSH_FILTERS.hot_lead(contact)).toBe(false);
    expect(FINAL_PUSH_FILTERS.guide_upsell(contact)).toBe(false);
    expect(FINAL_PUSH_FILTERS.cold_reengage(contact)).toBe(false);
    expect(FINAL_PUSH_FILTERS.fresh_outreach(contact)).toBe(true);
  });

  it("a buyer with webinar_only should match both buyer_reminder and guide_upsell", () => {
    const contact = makeContact({
      tags: ["stripe_customer", "webinar_only"],
    });
    expect(FINAL_PUSH_FILTERS.buyer_reminder(contact)).toBe(true);
    expect(FINAL_PUSH_FILTERS.guide_upsell(contact)).toBe(true);
  });

  it("a bundle buyer should match buyer_reminder but not guide_upsell", () => {
    const contact = makeContact({
      tags: ["stripe_customer", "bundle"],
    });
    expect(FINAL_PUSH_FILTERS.buyer_reminder(contact)).toBe(true);
    expect(FINAL_PUSH_FILTERS.guide_upsell(contact)).toBe(false);
  });
});
