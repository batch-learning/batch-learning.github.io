// Object in Container alignment failures of all methods, shown under misaligned videos in the Alignment Results
// section. OIC_ALIGNMENT_FAILURES[robot episode][method folder suffix]['<scene>/<human episode>'] = list of notes.
// The empty method suffix identifies BATCH (Ours); only displayed robot episode 1, Scene 2 is flagged.
// Displayed episodes are 1-based: episode 1 uses robot key "0" and Scene 2 uses "t2/3".
// Reviewed against synchronized sampled robot frames; representative times and display decisions are recorded
// in docs/object-in-container-annotation-audit.md. BATCH border exclusions follow the requested display policy.
window.OIC_ALIGNMENT_FAILURES = {
  "0": {
    "": {
      "t2/3": [
        {
          "text": "Phase mismatch: human grasping toy, robot putting toy in bowl."
        }
      ]
    },
    "_dinov3": {
      "t2/3": [
        {
          "text": "Phase mismatch: human grasping toy, robot placing bowl back."
        }
      ],
      "t4/2": [
        {
          "text": "Phase mismatch: human flipping bowl, robot grasping bowl."
        }
      ]
    },
    "_rel_actions": {
      "t1/0": [
        {
          "text": "Phase mismatch: human grasping toy, robot flipping bowl."
        }
      ],
      "t2/3": [
        {
          "text": "Phase mismatch: human putting toy in bowl, robot flipping bowl."
        }
      ],
      "t4/2": [
        {
          "text": "Phase mismatch: human grasping toy, robot flipping bowl."
        }
      ]
    },
    "_no_alignment": {
      "t1/0": [
        {
          "text": "Phase mismatch: human grasping toy, robot flipping bowl."
        }
      ],
      "t2/3": [
        {
          "text": "Phase mismatch: human putting toy in bowl, robot flipping bowl."
        }
      ],
      "t3/3": [
        {
          "text": "Phase mismatch: human putting toy in bowl, robot flipping bowl."
        }
      ],
      "t4/2": [
        {
          "text": "Phase mismatch: human flipping bowl, robot grasping toy."
        }
      ]
    }
  },
  "1": {
    "_dinov3": {
      "t3/4": [
        {
          "text": "Phase mismatch: human grasping toy, robot flipping bowl."
        }
      ],
      "t4/1": [
        {
          "text": "Phase mismatch: human grasping toy, robot placing bowl back."
        }
      ]
    },
    "_rel_actions": {
      "t1/0": [
        {
          "text": "Phase mismatch: human putting toy in bowl, robot grasping toy."
        }
      ],
      "t3/4": [
        {
          "text": "Phase mismatch: human flipping bowl, robot putting toy in bowl."
        }
      ],
      "t4/1": [
        {
          "text": "Phase mismatch: human grasping toy, robot flipping bowl."
        }
      ]
    },
    "_no_alignment": {
      "t1/0": [
        {
          "text": "Phase mismatch: human grasping toy, robot placing bowl back."
        }
      ],
      "t2/1": [
        {
          "text": "Phase mismatch: human grasping toy, robot putting toy in bowl."
        }
      ],
      "t3/4": [
        {
          "text": "Phase mismatch: human flipping bowl, robot placing bowl back."
        }
      ],
      "t4/1": [
        {
          "text": "Phase mismatch: human grasping toy, robot placing bowl back."
        }
      ]
    }
  },
  "2": {
    "_dinov3": {
      "t2/2": [
        {
          "text": "Phase mismatch: human putting toy in bowl, robot flipping bowl."
        }
      ],
      "t3/0": [
        {
          "text": "Phase mismatch: human putting toy in bowl, robot grasping toy."
        }
      ],
      "t4/3": [
        {
          "text": "Phase mismatch: human grasping bowl, robot putting toy in bowl."
        }
      ]
    },
    "_rel_actions": {
      "t1/2": [
        {
          "text": "Phase mismatch: human grasping bowl, robot flipping bowl."
        }
      ],
      "t4/3": [
        {
          "text": "Phase mismatch: human putting toy in bowl, robot flipping bowl."
        }
      ]
    },
    "_no_alignment": {
      "t1/2": [
        {
          "text": "Phase mismatch: human flipping bowl, robot putting toy in bowl."
        }
      ],
      "t2/2": [
        {
          "text": "Phase mismatch: human grasping bowl, robot flipping bowl."
        }
      ],
      "t3/0": [
        {
          "text": "Phase mismatch: human flipping bowl, robot grasping bowl."
        }
      ],
      "t4/3": [
        {
          "text": "Phase mismatch: human grasping toy, robot flipping bowl."
        }
      ]
    }
  },
  "3": {
    "_dinov3": {
      "t3/6": [
        {
          "text": "Phase mismatch: human putting toy in bowl, robot flipping bowl."
        }
      ],
      "t4/3": [
        {
          "text": "Phase mismatch: human putting toy in bowl, robot flipping bowl."
        }
      ]
    },
    "_rel_actions": {
      "t3/6": [
        {
          "text": "Phase mismatch: human flipping bowl, robot putting toy in bowl."
        }
      ],
      "t4/3": [
        {
          "text": "Phase mismatch: human flipping bowl, robot putting toy in bowl."
        }
      ],
      "t1/1": [
        {
          "text": "Phase mismatch: human placing bowl back, robot flipping bowl."
        }
      ]
    },
    "_no_alignment": {
      "t1/1": [
        {
          "text": "Phase mismatch: human putting toy in bowl, robot flipping bowl."
        }
      ],
      "t2/0": [
        {
          "text": "Phase mismatch: human grasping bowl, robot grasping toy."
        }
      ],
      "t3/6": [
        {
          "text": "Phase mismatch: human flipping bowl, robot grasping toy."
        }
      ],
      "t4/3": [
        {
          "text": "Phase mismatch: human grasping toy, robot putting toy in bowl."
        }
      ]
    }
  }
};

// Legacy approximate candidate time ranges (seconds). Object in Container does not currently wire these into
// task.failureSpans, so borders identify flagged clips throughout playback. These are not audited boundaries.
window.OIC_ALIGNMENT_SPANS = {
  "0": {
    "_dinov3": {
      "t2/3": [
        [
          12,
          24
        ]
      ],
      "t4/2": [
        [
          2,
          16
        ]
      ]
    },
    "_rel_actions": {
      "t1/0": [
        [
          5,
          21
        ]
      ],
      "t2/3": [
        [
          3,
          22
        ]
      ],
      "t4/2": [
        [
          0,
          16
        ]
      ]
    },
    "_no_alignment": {
      "t1/0": [
        [
          1.5,
          12
        ]
      ],
      "t2/3": [
        [
          1.5,
          26
        ]
      ],
      "t3/3": [
        [
          5,
          28.5
        ]
      ],
      "t4/2": [
        [
          5,
          26
        ]
      ]
    }
  },
  "1": {
    "_dinov3": {
      "t4/1": [
        [
          1.5,
          13.5
        ]
      ]
    },
    "_rel_actions": {
      "t1/0": [
        [
          7.5,
          23.7
        ]
      ],
      "t4/1": [
        [
          0,
          11.5
        ],
        [
          15.5,
          23.7
        ]
      ]
    },
    "_no_alignment": {
      "t1/0": [
        [
          1.5,
          19.5
        ]
      ],
      "t2/1": [
        [
          10,
          23.7
        ]
      ],
      "t4/1": [
        [
          0,
          9.5
        ]
      ]
    }
  },
  "2": {
    "_dinov3": {
      "t2/2": [
        [
          11.5,
          18.9
        ]
      ]
    },
    "_rel_actions": {
      "t1/2": [
        [
          13.5,
          18.9
        ]
      ],
      "t4/3": [
        [
          0,
          3.5
        ],
        [
          13.5,
          18.9
        ]
      ]
    },
    "_no_alignment": {
      "t1/2": [
        [
          5.5,
          15.5
        ]
      ],
      "t2/2": [
        [
          13.5,
          18.9
        ]
      ],
      "t3/0": [
        [
          0,
          13.5
        ]
      ],
      "t4/3": [
        [
          3.5,
          18.9
        ]
      ]
    }
  },
  "3": {
    "_dinov3": {
      "t4/3": [
        [
          13,
          25.3
        ]
      ]
    },
    "_rel_actions": {
      "t4/3": [
        [
          7.5,
          16.5
        ]
      ]
    },
    "_no_alignment": {
      "t1/1": [
        [
          13,
          25.3
        ]
      ],
      "t2/0": [
        [
          0,
          9.5
        ],
        [
          16,
          21.5
        ]
      ],
      "t4/3": [
        [
          7.5,
          20
        ]
      ]
    }
  }
};
