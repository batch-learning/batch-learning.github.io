// Cup on Saucer alignment failures of the baselines, shown under misaligned videos in the Alignment Results section.
// CUP_ALIGNMENT_FAILURES[robot episode][method folder suffix][human episode] = list of notes { text, when? }.
// A note with `when` = [start, end] (seconds) is only shown while that part of the video plays.
<<<<<<< HEAD
// Current page selections were reviewed with synchronized frames; see docs/cup-on-saucer-annotation-audit.md.
=======
>>>>>>> 6bcc1f6eb5dbfe53106c4fa1daf90078a998f5ec
// Generated from task phases annotated by eye on every robot episode and human recording (reach, lift, hand over,
// place, done, plus the human resetting the cup). A video is listed when, for at least 2 s or 30% of it, the human is
// resetting the cup or is in a different task phase than the robot (Phase mismatch).
window.CUP_ALIGNMENT_FAILURES = {
  "0": {
    "_dinov3": {
      "1": [
        {
          "text": "Phase mismatch: human handing over, robot reaching."
        }
      ],
      "3": [
        {
          "text": "Phase mismatch: human handing over, robot reaching."
        }
      ],
      "5": [
        {
          "text": "Phase mismatch: human handing over, robot reaching."
        }
      ],
      "7": [
        {
          "text": "Phase mismatch: human handing over, robot reaching."
        }
      ],
      "9": [
        {
          "text": "Phase mismatch: human placing, robot handing over."
        }
      ],
      "13": [
        {
          "text": "Phase mismatch: human done, robot handing over."
        }
      ],
      "15": [
        {
          "text": "Phase mismatch: human placing, robot handing over."
        }
      ],
      "19": [
        {
          "text": "Phase mismatch: human placing, robot handing over."
        }
      ],
      "21": [
        {
          "text": "Phase mismatch: human placing, robot handing over."
        }
      ],
      "22": [
        {
          "text": "Phase mismatch: human handing over, robot reaching."
        }
      ],
      "23": [
        {
          "text": "Phase mismatch: human done, robot handing over."
        }
      ]
    },
    "_no_alignment": {
      "1": [
        {
          "text": "Phase mismatch: human done, robot placing."
        },
        {
          "text": "Contains irrelevant segments: human resetting the cup.",
          "when": [
            9.87,
            12.33
          ]
        }
      ],
      "3": [
        {
          "text": "Phase mismatch: human done, robot placing."
        },
        {
          "text": "Contains irrelevant segments: human resetting the cup.",
          "when": [
            9.87,
            12.33
          ]
        }
      ],
      "5": [
        {
          "text": "Contains irrelevant segments: human resetting the cup.",
          "when": [
            0.0,
            3.73
          ]
        },
        {
          "text": "Phase mismatch: human reaching, robot handing over."
        }
      ],
      "7": [
        {
          "text": "Contains irrelevant segments: human resetting the cup.",
          "when": [
            0.0,
            3.93
          ]
        },
        {
          "text": "Phase mismatch: human reaching, robot handing over."
        }
      ],
      "19": [
        {
          "text": "Phase mismatch: human reaching, robot handing over."
        }
      ],
      "22": [
        {
          "text": "Phase mismatch: human reaching, robot handing over."
        }
      ]
    }
  },
  "2": {
    "_dinov3": {
      "1": [
        {
          "text": "Phase mismatch: human done, robot lifting."
        },
        {
          "text": "Contains irrelevant segments: human resetting the cup.",
          "when": [
            4.67,
            10.4
          ]
        }
      ],
      "3": [
        {
          "text": "Phase mismatch: human done, robot lifting."
        },
        {
          "text": "Contains irrelevant segments: human resetting the cup.",
          "when": [
            6.53,
            10.4
          ]
        }
      ],
      "5": [
        {
          "text": "Phase mismatch: human handing over, robot lifting."
        }
      ],
      "7": [
        {
          "text": "Phase mismatch: human handing over, robot lifting."
        }
      ],
      "9": [
        {
          "text": "Phase mismatch: human done, robot handing over."
        }
      ],
      "11": [
        {
          "text": "Phase mismatch: human placing, robot handing over."
        }
      ],
      "13": [
        {
          "text": "Phase mismatch: human placing, robot handing over."
        }
      ],
      "15": [
        {
          "text": "Phase mismatch: human done, robot handing over."
        }
      ],
      "19": [
        {
          "text": "Phase mismatch: human done, robot handing over."
        }
      ],
      "21": [
        {
          "text": "Phase mismatch: human placing, robot handing over."
        }
      ],
      "22": [
        {
          "text": "Phase mismatch: human placing, robot lifting."
        }
      ],
      "23": [
        {
          "text": "Phase mismatch: human placing, robot handing over."
        }
      ]
    },
    "_no_alignment": {
      "1": [
        {
          "text": "Phase mismatch: human done, robot placing."
        },
        {
          "text": "Contains irrelevant segments: human resetting the cup.",
          "when": [
            8.33,
            10.4
          ]
        }
      ],
      "3": [
        {
          "text": "Phase mismatch: human done, robot placing."
        },
        {
          "text": "Contains irrelevant segments: human resetting the cup.",
          "when": [
            8.27,
            10.4
          ]
        }
      ],
      "5": [
        {
          "text": "Contains irrelevant segments: human resetting the cup.",
          "when": [
            0.0,
            3.13
          ]
        },
        {
          "text": "Phase mismatch: human reaching, robot handing over."
        }
      ],
      "7": [
        {
          "text": "Contains irrelevant segments: human resetting the cup.",
          "when": [
            0.0,
            3.27
          ]
        },
        {
          "text": "Phase mismatch: human reaching, robot handing over."
        }
      ]
    }
  },
  "30": {
    "_dinov3": {
      "0": [
        {
          "text": "Phase mismatch: human handing over, robot reaching."
        }
      ],
      "2": [
        {
          "text": "Phase mismatch: human reaching, robot handing over."
        }
      ],
      "4": [
        {
          "text": "Phase mismatch: human handing over, robot reaching."
        }
      ],
      "6": [
        {
          "text": "Phase mismatch: human handing over, robot reaching."
        }
      ],
      "8": [
        {
          "text": "Phase mismatch: human placing, robot lifting."
        }
      ],
      "10": [
        {
          "text": "Phase mismatch: human handing over, robot reaching."
        }
      ],
      "12": [
        {
          "text": "Phase mismatch: human handing over, robot reaching."
        }
      ],
      "14": [
        {
          "text": "Phase mismatch: human handing over, robot reaching."
        }
      ],
      "16": [
        {
          "text": "Phase mismatch: human handing over, robot reaching."
        }
      ],
      "18": [
        {
          "text": "Phase mismatch: human lifting, robot placing."
        }
      ],
      "20": [
        {
          "text": "Phase mismatch: human handing over, robot reaching."
        }
      ]
    },
    "_abs_actions": {
      "2": [
        {
          "text": "Phase mismatch: human lifting, robot reaching."
        }
      ],
      "4": [
        {
          "text": "Phase mismatch: human lifting, robot reaching."
        }
      ],
      "6": [
        {
          "text": "Phase mismatch: human lifting, robot reaching."
        }
      ]
    },
    "_no_alignment": {
      "0": [
        {
          "text": "Contains irrelevant segments: human resetting the cup.",
          "when": [
            0.0,
            1.73
          ]
        },
        {
          "text": "Phase mismatch: human reaching, robot handing over."
        }
      ],
      "2": [
        {
          "text": "Contains irrelevant segments: human resetting the cup.",
          "when": [
            0.0,
            1.67
          ]
        },
        {
          "text": "Phase mismatch: human reaching, robot handing over."
        }
      ],
      "4": [
        {
          "text": "Phase mismatch: human done, robot placing."
        }
      ],
      "6": [
        {
          "text": "Phase mismatch: human done, robot placing."
        },
        {
          "text": "Contains irrelevant segments: human resetting the cup.",
          "when": [
            10.67,
            11.6
          ]
        }
      ]
    }
  },
  "31": {
    "_dinov3": {
      "0": [
        {
          "text": "Phase mismatch: human handing over, robot lifting."
        }
      ],
      "2": [
        {
          "text": "Phase mismatch: human reaching, robot placing."
        }
      ],
      "4": [
        {
          "text": "Phase mismatch: human done, robot handing over."
        }
      ],
      "6": [
        {
          "text": "Phase mismatch: human handing over, robot reaching."
        }
      ],
      "8": [
        {
          "text": "Phase mismatch: human placing, robot handing over."
        }
      ],
      "10": [
        {
          "text": "Phase mismatch: human handing over, robot lifting."
        }
      ],
      "12": [
        {
          "text": "Phase mismatch: human handing over, robot reaching."
        }
      ],
      "14": [
        {
          "text": "Phase mismatch: human placing, robot handing over."
        }
      ],
      "16": [
        {
          "text": "Phase mismatch: human handing over, robot lifting."
        }
      ],
      "18": [
        {
          "text": "Phase mismatch: human handing over, robot lifting."
        }
      ],
      "20": [
        {
          "text": "Phase mismatch: human handing over, robot reaching."
        }
      ]
    },
    "_abs_actions": {
      "0": [
        {
          "text": "Contains irrelevant segments: human resetting the cup.",
          "when": [
            0.0,
            0.67
          ]
        },
        {
          "text": "Phase mismatch: human reaching, robot handing over."
        }
      ],
      "4": [
        {
          "text": "Phase mismatch: human handing over, robot placing."
        }
      ],
      "14": [
        {
          "text": "Phase mismatch: human reaching, robot lifting."
        }
      ],
      "16": [
        {
          "text": "Phase mismatch: human reaching, robot handing over."
        }
      ],
      "18": [
        {
          "text": "Phase mismatch: human reaching, robot handing over."
        }
      ],
      "20": [
        {
          "text": "Phase mismatch: human reaching, robot handing over."
        }
      ]
    },
    "_no_alignment": {
      "0": [
        {
          "text": "Contains irrelevant segments: human resetting the cup.",
          "when": [
            0.0,
            1.8
          ]
        },
        {
          "text": "Phase mismatch: human reaching, robot lifting."
        }
      ],
      "2": [
        {
          "text": "Contains irrelevant segments: human resetting the cup.",
          "when": [
            0.0,
            1.73
          ]
        },
        {
          "text": "Phase mismatch: human reaching, robot handing over."
        }
      ],
      "4": [
        {
          "text": "Phase mismatch: human done, robot placing."
        }
      ],
      "6": [
        {
          "text": "Phase mismatch: human done, robot placing."
        },
        {
          "text": "Contains irrelevant segments: human resetting the cup.",
          "when": [
            11.27,
            12.27
          ]
        }
      ]
    }
  },
  "62": {
    "_dinov3": {
      "1": [
        {
          "text": "Phase mismatch: human done, robot lifting."
        },
        {
          "text": "Contains irrelevant segments: human resetting the cup.",
          "when": [
            4.53,
            10.4
          ]
        }
      ],
      "3": [
        {
          "text": "Phase mismatch: human done, robot lifting."
        },
        {
          "text": "Contains irrelevant segments: human resetting the cup.",
          "when": [
            6.4,
            10.4
          ]
        }
      ],
      "5": [
        {
          "text": "Phase mismatch: human handing over, robot reaching."
        }
      ],
      "7": [
        {
          "text": "Phase mismatch: human placing, robot handing over."
        }
      ],
      "9": [
        {
          "text": "Phase mismatch: human done, robot handing over."
        }
      ],
      "11": [
        {
          "text": "Phase mismatch: human placing, robot handing over."
        }
      ],
      "13": [
        {
          "text": "Phase mismatch: human done, robot handing over."
        }
      ],
      "15": [
        {
          "text": "Phase mismatch: human done, robot handing over."
        }
      ],
      "19": [
        {
          "text": "Phase mismatch: human done, robot handing over."
        }
      ],
      "21": [
        {
          "text": "Phase mismatch: human done, robot handing over."
        }
      ],
      "22": [
        {
          "text": "Phase mismatch: human placing, robot handing over."
        }
      ],
      "23": [
        {
          "text": "Phase mismatch: human done, robot handing over."
        }
      ]
    },
    "_no_alignment": {
      "1": [
        {
          "text": "Phase mismatch: human done, robot handing over."
        },
        {
          "text": "Contains irrelevant segments: human resetting the cup.",
          "when": [
            8.33,
            10.4
          ]
        }
      ],
      "3": [
        {
          "text": "Phase mismatch: human done, robot placing."
        },
        {
          "text": "Contains irrelevant segments: human resetting the cup.",
          "when": [
            8.27,
            10.4
          ]
        }
      ],
      "5": [
        {
          "text": "Contains irrelevant segments: human resetting the cup.",
          "when": [
            0.0,
            3.13
          ]
        },
        {
          "text": "Phase mismatch: human reaching, robot handing over."
        }
      ],
      "7": [
        {
          "text": "Contains irrelevant segments: human resetting the cup.",
          "when": [
            0.0,
            3.27
          ]
        },
        {
          "text": "Phase mismatch: human reaching, robot handing over."
        }
      ]
    }
  },
  "63": {
    "_dinov3": {
      "1": [
        {
          "text": "Phase mismatch: human done, robot lifting."
        },
        {
          "text": "Contains irrelevant segments: human resetting the cup.",
          "when": [
            5.2,
            11.07
          ]
        }
      ],
      "3": [
        {
          "text": "Phase mismatch: human handing over, robot reaching."
        }
      ],
      "5": [
        {
          "text": "Phase mismatch: human handing over, robot reaching."
        }
      ],
      "7": [
        {
          "text": "Phase mismatch: human handing over, robot reaching."
        }
      ],
      "9": [
        {
          "text": "Phase mismatch: human placing, robot handing over."
        }
      ],
      "11": [
        {
          "text": "Phase mismatch: human placing, robot handing over."
        }
      ],
      "13": [
        {
          "text": "Phase mismatch: human done, robot handing over."
        }
      ],
      "15": [
        {
          "text": "Phase mismatch: human done, robot handing over."
        }
      ],
      "17": [
        {
          "text": "Phase mismatch: human done, robot placing."
        }
      ],
      "19": [
        {
          "text": "Phase mismatch: human done, robot handing over."
        }
      ],
      "21": [
        {
          "text": "Phase mismatch: human done, robot handing over."
        }
      ],
      "22": [
        {
          "text": "Phase mismatch: human handing over, robot reaching."
        }
      ],
      "23": [
        {
          "text": "Phase mismatch: human done, robot handing over."
        }
      ]
    },
    "_no_alignment": {
      "1": [
        {
          "text": "Phase mismatch: human done, robot placing."
        },
        {
          "text": "Contains irrelevant segments: human resetting the cup.",
          "when": [
            8.87,
            11.07
          ]
        }
      ],
      "3": [
        {
          "text": "Phase mismatch: human done, robot placing."
        },
        {
          "text": "Contains irrelevant segments: human resetting the cup.",
          "when": [
            8.8,
            11.07
          ]
        }
      ],
      "5": [
        {
          "text": "Contains irrelevant segments: human resetting the cup.",
          "when": [
            0.0,
            3.33
          ]
        },
        {
          "text": "Phase mismatch: human reaching, robot handing over."
        }
      ],
      "7": [
        {
          "text": "Contains irrelevant segments: human resetting the cup.",
          "when": [
            0.0,
            3.53
          ]
        },
        {
          "text": "Phase mismatch: human reaching, robot handing over."
        }
      ],
      "15": [
        {
          "text": "Phase mismatch: human reaching, robot handing over."
        }
      ],
      "17": [
        {
          "text": "Phase mismatch: human reaching, robot handing over."
        }
      ],
      "19": [
        {
          "text": "Phase mismatch: human reaching, robot handing over."
        }
      ],
      "22": [
        {
          "text": "Phase mismatch: human reaching, robot handing over."
        }
      ],
      "23": [
        {
          "text": "Phase mismatch: human reaching, robot handing over."
        }
      ]
    }
  },
  "114": {
    "_dinov3": {
      "0": [
        {
          "text": "Phase mismatch: human handing over, robot reaching."
        }
      ],
      "2": [
        {
          "text": "Phase mismatch: human reaching, robot handing over."
        }
      ],
      "4": [
        {
          "text": "Phase mismatch: human done, robot lifting."
        }
      ],
      "8": [
        {
          "text": "Phase mismatch: human placing, robot lifting."
        }
      ],
      "10": [
        {
          "text": "Phase mismatch: human handing over, robot reaching."
        }
      ],
      "12": [
        {
          "text": "Phase mismatch: human handing over, robot reaching."
        }
      ],
      "14": [
        {
          "text": "Phase mismatch: human handing over, robot lifting."
        }
      ],
      "16": [
        {
          "text": "Phase mismatch: human handing over, robot reaching."
        }
      ],
      "18": [
        {
          "text": "Phase mismatch: human reaching, robot handing over."
        }
      ],
      "20": [
        {
          "text": "Phase mismatch: human handing over, robot reaching."
        }
      ]
    },
    "_abs_actions": {
      "0": [
        {
          "text": "Phase mismatch: human reaching, robot handing over."
        }
      ],
      "2": [
        {
          "text": "Phase mismatch: human reaching, robot handing over."
        }
      ],
      "6": [
        {
          "text": "Phase mismatch: human lifting, robot reaching."
        }
      ],
      "8": [
        {
          "text": "Phase mismatch: human placing, robot lifting."
        }
      ],
      "16": [
        {
          "text": "Phase mismatch: human handing over, robot placing."
        }
<<<<<<< HEAD
      ],
      "20": [
        {
          "text": "Phase mismatch: human handing over, robot placing."
        }
=======
>>>>>>> 6bcc1f6eb5dbfe53106c4fa1daf90078a998f5ec
      ]
    },
    "_no_alignment": {
      "0": [
        {
          "text": "Contains irrelevant segments: human resetting the cup.",
          "when": [
            0.0,
            1.6
          ]
        },
        {
          "text": "Phase mismatch: human reaching, robot handing over."
        }
      ],
      "2": [
        {
          "text": "Contains irrelevant segments: human resetting the cup.",
          "when": [
            0.0,
            1.53
          ]
        },
        {
          "text": "Phase mismatch: human reaching, robot handing over."
        }
      ],
      "14": [
        {
          "text": "Phase mismatch: human reaching, robot handing over."
        }
      ]
    }
  },
  "124": {
    "_dinov3": {
      "0": [
        {
          "text": "Phase mismatch: human reaching, robot placing."
        }
      ],
      "2": [
        {
          "text": "Phase mismatch: human reaching, robot placing."
        }
      ],
      "4": [
        {
          "text": "Phase mismatch: human placing, robot lifting."
        }
      ],
      "6": [
        {
          "text": "Phase mismatch: human reaching, robot placing."
        }
      ],
      "8": [
        {
          "text": "Phase mismatch: human handing over, robot reaching."
        }
      ],
      "10": [
        {
          "text": "Phase mismatch: human reaching, robot placing."
        }
      ],
      "12": [
        {
          "text": "Phase mismatch: human handing over, robot reaching."
        }
      ],
      "14": [
        {
          "text": "Phase mismatch: human handing over, robot reaching."
        }
      ],
      "16": [
        {
          "text": "Phase mismatch: human reaching, robot placing."
        }
      ],
      "18": [
        {
          "text": "Phase mismatch: human reaching, robot placing."
        }
      ],
      "20": [
        {
          "text": "Phase mismatch: human lifting, robot reaching."
        }
      ]
    },
    "_abs_actions": {
      "0": [
        {
          "text": "Phase mismatch: human lifting, robot reaching."
        }
      ],
      "2": [
        {
          "text": "Phase mismatch: human handing over, robot reaching."
        }
      ],
      "4": [
        {
          "text": "Phase mismatch: human lifting, robot reaching."
        }
      ],
      "6": [
        {
          "text": "Phase mismatch: human handing over, robot reaching."
        }
      ],
      "8": [
        {
          "text": "Phase mismatch: human lifting, robot reaching."
        }
      ],
      "10": [
        {
          "text": "Phase mismatch: human handing over, robot placing."
        }
      ],
      "12": [
        {
          "text": "Phase mismatch: human handing over, robot reaching."
        }
      ],
      "14": [
        {
          "text": "Phase mismatch: human handing over, robot placing."
        }
      ],
      "16": [
        {
          "text": "Phase mismatch: human handing over, robot placing."
        }
      ],
      "18": [
        {
          "text": "Phase mismatch: human handing over, robot placing."
        }
      ],
      "20": [
        {
          "text": "Phase mismatch: human handing over, robot placing."
        }
      ]
    },
    "_no_alignment": {
      "0": [
        {
          "text": "Contains irrelevant segments: human resetting the cup.",
          "when": [
            0.0,
            1.8
          ]
        },
        {
          "text": "Phase mismatch: human reaching, robot placing."
        }
      ],
      "2": [
        {
          "text": "Contains irrelevant segments: human resetting the cup.",
          "when": [
            0.0,
            1.73
          ]
        },
        {
          "text": "Phase mismatch: human reaching, robot placing."
        }
      ],
      "4": [
        {
          "text": "Phase mismatch: human handing over, robot placing."
        }
      ],
      "6": [
        {
          "text": "Phase mismatch: human handing over, robot placing."
        }
      ],
      "8": [
        {
          "text": "Phase mismatch: human reaching, robot placing."
        }
      ],
      "10": [
        {
          "text": "Phase mismatch: human reaching, robot placing."
        }
      ],
      "12": [
        {
          "text": "Phase mismatch: human reaching, robot placing."
        }
      ],
      "14": [
        {
          "text": "Phase mismatch: human reaching, robot placing."
        }
      ],
      "16": [
        {
          "text": "Phase mismatch: human reaching, robot placing."
        }
      ],
      "18": [
        {
          "text": "Phase mismatch: human reaching, robot placing."
        }
      ],
      "20": [
        {
          "text": "Phase mismatch: human reaching, robot placing."
        }
      ]
    }
  }
};

<<<<<<< HEAD
// Legacy approximate time ranges (seconds). The Cup task does not wire these into task.failureSpans,
// so its red borders flag whole clips. Timed reset notes use their own `when` ranges; boundaries are approximate.
=======
// Out-of-sync time ranges (seconds) of each flagged baseline video; its red border is shown only during them.
>>>>>>> 6bcc1f6eb5dbfe53106c4fa1daf90078a998f5ec
window.CUP_ALIGNMENT_SPANS = {
  "0": {
    "_dinov3": {
      "1": [
        [
          0.0,
          3.07
        ]
      ],
      "3": [
        [
          0.0,
          3.07
        ]
      ],
      "5": [
        [
          0.0,
          3.13
        ]
      ],
      "7": [
        [
          0.0,
          3.6
        ]
      ],
      "9": [
        [
          0.0,
          8.53
        ]
      ],
      "13": [
        [
          0.4,
          3.6
        ],
        [
          4.2,
          9.47
        ]
      ],
      "15": [
        [
          0.0,
          9.87
        ]
      ],
      "19": [
        [
          0.0,
          9.87
        ]
      ],
      "21": [
        [
          0.0,
          9.07
        ]
      ],
      "22": [
        [
          0.0,
          3.6
        ]
      ],
      "23": [
        [
          0.0,
          10.0
        ]
      ]
    },
    "_no_alignment": {
      "1": [
        [
          6.27,
          12.33
        ]
      ],
      "3": [
        [
          6.47,
          12.33
        ]
      ],
      "5": [
        [
          0.0,
          9.07
        ]
      ],
      "7": [
        [
          0.0,
          9.07
        ]
      ],
      "19": [
        [
          2.8,
          4.87
        ]
      ],
      "22": [
        [
          2.8,
          5.07
        ]
      ]
    }
  },
  "2": {
    "_dinov3": {
      "1": [
        [
          0.0,
          10.4
        ]
      ],
      "3": [
        [
          0.0,
          10.4
        ]
      ],
      "5": [
        [
          0.0,
          3.53
        ]
      ],
      "7": [
        [
          0.0,
          6.33
        ]
      ],
      "9": [
        [
          0.0,
          9.4
        ]
      ],
      "11": [
        [
          0.0,
          8.6
        ]
      ],
      "13": [
        [
          0.0,
          9.0
        ]
      ],
      "15": [
        [
          0.0,
          9.4
        ]
      ],
      "19": [
        [
          0.0,
          9.4
        ]
      ],
      "21": [
        [
          0.0,
          8.6
        ]
      ],
      "22": [
        [
          0.0,
          8.47
        ]
      ],
      "23": [
        [
          0.0,
          8.6
        ]
      ]
    },
    "_no_alignment": {
      "1": [
        [
          4.33,
          10.4
        ]
      ],
      "3": [
        [
          4.8,
          10.4
        ]
      ],
      "5": [
        [
          0.0,
          7.2
        ]
      ],
      "7": [
        [
          0.0,
          7.07
        ]
      ]
    }
  },
  "30": {
    "_dinov3": {
      "0": [
        [
          0.0,
          3.8
        ]
      ],
      "2": [
        [
          2.6,
          11.6
        ]
      ],
      "4": [
        [
          0.0,
          3.67
        ]
      ],
      "6": [
        [
          0.0,
          3.6
        ]
      ],
      "8": [
        [
          0.0,
          8.47
        ]
      ],
      "10": [
        [
          0.0,
          5.93
        ]
      ],
      "12": [
        [
          0.13,
          3.4
        ]
      ],
      "14": [
        [
          0.0,
          8.73
        ]
      ],
      "16": [
        [
          0.4,
          3.67
        ]
      ],
      "18": [
        [
          2.73,
          11.6
        ]
      ],
      "20": [
        [
          0.0,
          3.8
        ]
      ]
    },
    "_abs_actions": {
      "2": [
        [
          0.13,
          2.73
        ]
      ],
      "4": [
        [
          0.13,
          2.33
        ]
      ],
      "6": [
        [
          0.0,
          2.87
        ]
      ]
    },
    "_no_alignment": {
      "0": [
        [
          0.0,
          1.73
        ],
        [
          2.33,
          6.33
        ]
      ],
      "2": [
        [
          0.0,
          1.67
        ],
        [
          2.33,
          6.73
        ]
      ],
      "4": [
        [
          5.47,
          10.4
        ]
      ],
      "6": [
        [
          5.47,
          11.6
        ]
      ]
    }
  },
  "31": {
    "_dinov3": {
      "0": [
        [
          0.0,
          6.67
        ]
      ],
      "2": [
        [
          3.13,
          12.27
        ]
      ],
      "4": [
        [
          0.0,
          10.0
        ]
      ],
      "6": [
        [
          0.0,
          5.73
        ]
      ],
      "8": [
        [
          0.0,
          9.93
        ]
      ],
      "10": [
        [
          0.0,
          9.67
        ]
      ],
      "12": [
        [
          0.4,
          4.4
        ]
      ],
      "14": [
        [
          0.0,
          10.87
        ]
      ],
      "16": [
        [
          1.47,
          4.47
        ]
      ],
      "18": [
        [
          0.0,
          9.13
        ]
      ],
      "20": [
        [
          1.07,
          4.33
        ]
      ]
    },
    "_abs_actions": {
      "0": [
        [
          0.0,
          0.67
        ],
        [
          2.8,
          12.27
        ]
      ],
      "4": [
        [
          7.6,
          12.27
        ]
      ],
      "14": [
        [
          3.6,
          5.47
        ],
        [
          8.87,
          10.8
        ]
      ],
      "16": [
        [
          3.87,
          6.4
        ]
      ],
      "18": [
        [
          3.33,
          6.93
        ],
        [
          7.67,
          10.53
        ]
      ],
      "20": [
        [
          3.93,
          6.0
        ],
        [
          8.73,
          10.67
        ]
      ]
    },
    "_no_alignment": {
      "0": [
        [
          0.0,
          1.8
        ],
        [
          2.8,
          6.6
        ]
      ],
      "2": [
        [
          0.0,
          1.73
        ],
        [
          2.8,
          7.13
        ]
      ],
      "4": [
        [
          3.07,
          4.13
        ],
        [
          5.27,
          10.67
        ]
      ],
      "6": [
        [
          3.07,
          4.2
        ],
        [
          5.27,
          12.27
        ]
      ]
    }
  },
  "62": {
    "_dinov3": {
      "1": [
        [
          0.0,
          10.4
        ]
      ],
      "3": [
        [
          0.0,
          10.4
        ]
      ],
      "5": [
        [
          0.0,
          3.33
        ]
      ],
      "7": [
        [
          0.0,
          8.93
        ]
      ],
      "9": [
        [
          0.0,
          9.4
        ]
      ],
      "11": [
        [
          0.0,
          8.93
        ]
      ],
      "13": [
        [
          0.0,
          9.4
        ]
      ],
      "15": [
        [
          0.0,
          9.4
        ]
      ],
      "19": [
        [
          0.0,
          9.4
        ]
      ],
      "21": [
        [
          0.0,
          9.0
        ]
      ],
      "22": [
        [
          0.0,
          9.4
        ]
      ],
      "23": [
        [
          0.0,
          9.4
        ]
      ]
    },
    "_no_alignment": {
      "1": [
        [
          4.4,
          10.4
        ]
      ],
      "3": [
        [
          4.8,
          10.4
        ]
      ],
      "5": [
        [
          0.0,
          7.0
        ]
      ],
      "7": [
        [
          0.0,
          7.0
        ]
      ]
    }
  },
  "63": {
    "_dinov3": {
      "1": [
        [
          0.0,
          11.07
        ]
      ],
      "3": [
        [
          0.0,
          2.8
        ]
      ],
      "5": [
        [
          0.0,
          2.87
        ]
      ],
      "7": [
        [
          0.0,
          4.4
        ]
      ],
      "9": [
        [
          0.0,
          8.6
        ]
      ],
      "11": [
        [
          0.0,
          8.73
        ]
      ],
      "13": [
        [
          0.0,
          10.0
        ]
      ],
      "15": [
        [
          0.0,
          10.0
        ]
      ],
      "17": [
        [
          0.0,
          9.93
        ]
      ],
      "19": [
        [
          0.0,
          10.0
        ]
      ],
      "21": [
        [
          0.0,
          9.4
        ]
      ],
      "22": [
        [
          0.0,
          5.0
        ]
      ],
      "23": [
        [
          0.0,
          10.0
        ]
      ]
    },
    "_no_alignment": {
      "1": [
        [
          6.4,
          11.07
        ]
      ],
      "3": [
        [
          6.4,
          11.07
        ]
      ],
      "5": [
        [
          0.0,
          7.93
        ]
      ],
      "7": [
        [
          0.0,
          8.0
        ]
      ],
      "15": [
        [
          2.27,
          4.33
        ]
      ],
      "17": [
        [
          2.27,
          4.4
        ]
      ],
      "19": [
        [
          2.27,
          4.47
        ]
      ],
      "22": [
        [
          2.2,
          4.67
        ]
      ],
      "23": [
        [
          2.27,
          4.33
        ]
      ]
    }
  },
  "114": {
    "_dinov3": {
      "0": [
        [
          0.0,
          2.8
        ]
      ],
      "2": [
        [
          2.07,
          7.0
        ]
      ],
      "4": [
        [
          0.0,
          6.2
        ]
      ],
      "8": [
        [
          0.0,
          5.53
        ]
      ],
      "10": [
        [
          0.0,
          3.0
        ]
      ],
      "12": [
        [
          0.0,
          3.33
        ]
      ],
      "14": [
        [
          0.0,
          4.47
        ]
      ],
      "16": [
        [
          0.0,
          3.33
        ]
      ],
      "18": [
        [
          2.27,
          7.0
        ]
      ],
      "20": [
        [
          0.0,
          3.2
        ]
      ]
    },
    "_abs_actions": {
      "0": [
        [
          2.13,
          7.0
        ]
      ],
      "2": [
        [
          2.07,
          7.0
        ]
      ],
      "6": [
        [
          0.0,
          2.33
        ],
        [
          6.0,
          7.0
        ]
      ],
      "8": [
        [
          0.0,
          5.53
        ]
      ],
      "16": [
        [
          4.93,
          7.0
        ]
      ]
    },
    "_no_alignment": {
      "0": [
        [
          0.0,
          7.0
        ]
      ],
      "2": [
        [
          0.0,
          7.0
        ]
      ],
      "14": [
        [
          2.6,
          6.8
        ]
      ]
    }
  },
  "124": {
    "_dinov3": {
      "0": [
        [
          1.6,
          5.0
        ]
      ],
      "2": [
        [
          1.53,
          5.0
        ]
      ],
      "4": [
        [
          0.0,
          2.87
        ]
      ],
      "6": [
        [
          1.33,
          5.0
        ]
      ],
      "8": [
        [
          0.0,
          1.73
        ]
      ],
      "10": [
        [
          1.4,
          5.0
        ]
      ],
      "12": [
        [
          0.0,
          1.6
        ]
      ],
      "14": [
        [
          0.0,
          1.6
        ]
      ],
      "16": [
        [
          1.33,
          5.0
        ]
      ],
      "18": [
        [
          1.33,
          5.0
        ]
      ],
      "20": [
        [
          0.13,
          1.47
        ],
        [
          4.07,
          5.0
        ]
      ]
    },
    "_abs_actions": {
      "0": [
        [
          0.0,
          1.47
        ],
        [
          3.67,
          5.0
        ]
      ],
      "2": [
        [
          0.0,
          1.53
        ],
        [
          4.2,
          5.0
        ]
      ],
      "4": [
        [
          0.0,
          1.2
        ],
        [
          3.13,
          5.0
        ]
      ],
      "6": [
        [
          0.0,
          1.53
        ],
        [
          4.27,
          5.0
        ]
      ],
      "8": [
        [
          0.0,
          1.47
        ],
        [
          3.93,
          5.0
        ]
      ],
      "10": [
        [
          3.4,
          5.0
        ]
      ],
      "12": [
        [
          0.0,
          1.6
        ]
      ],
      "14": [
        [
          0.27,
          1.33
        ],
        [
          3.8,
          5.0
        ]
      ],
      "16": [
        [
          3.13,
          5.0
        ]
      ],
      "18": [
        [
          1.8,
          5.0
        ]
      ],
      "20": [
        [
          3.13,
          5.0
        ]
      ]
    },
    "_no_alignment": {
      "0": [
        [
          0.0,
          5.0
        ]
      ],
      "2": [
        [
          0.0,
          5.0
        ]
      ],
      "4": [
        [
          1.53,
          5.0
        ]
      ],
      "6": [
        [
          1.53,
          5.0
        ]
      ],
      "8": [
        [
          1.33,
          5.0
        ]
      ],
      "10": [
        [
          1.4,
          5.0
        ]
      ],
      "12": [
        [
          1.4,
          5.0
        ]
      ],
      "14": [
        [
          1.4,
          5.0
        ]
      ],
      "16": [
        [
          1.4,
          5.0
        ]
      ],
      "18": [
        [
          1.4,
          5.0
        ]
      ],
      "20": [
        [
          1.4,
          5.0
        ]
      ]
    }
  }
};
