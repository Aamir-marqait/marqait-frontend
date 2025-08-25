export interface SupportCard {
  id: string;
  title: string;
  description: string;
  content: {
    overview: string;
    sections: {
      title: string;
      content: string;
    }[];
    faq?: {
      question: string;
      answer: string;
    }[];
    relatedLinks?: {
      title: string;
      url: string;
    }[];
  };
}

export const supportCards: SupportCard[] = [
  {
    id: "tech-support",
    title: "Tech Support",
    description: "Get help with technical issues and troubleshooting.",
    content: {
      overview: "Our technical support team is here to help you resolve any technical issues you might encounter while using MARQAIT. From account setup to advanced features, we've got you covered.",
      sections: [
        {
          title: "Common Issues",
          content: "Login problems, feature access issues, and performance concerns are the most common technical issues. We provide step-by-step solutions for quick resolution."
        },
        {
          title: "System Requirements",
          content: "MARQAIT works best on modern browsers including Chrome, Firefox, Safari, and Edge. Ensure you have a stable internet connection for optimal performance."
        },
        {
          title: "Account Management",
          content: "Learn how to manage your account settings, update preferences, and configure your workspace for maximum productivity."
        }
      ],
      faq: [
        {
          question: "Why can't I log into my account?",
          answer: "Check your email and password. If you're still having issues, try resetting your password or clearing your browser cache."
        },
        {
          question: "How do I update my account settings?",
          answer: "Navigate to Settings in your dashboard and update your profile information, preferences, and security settings."
        }
      ],
      relatedLinks: [
        { title: "Account Settings", url: "/settings" },
        { title: "Password Reset", url: "/accounts/password/reset" }
      ]
    }
  },
  {
    id: "billing-support",
    title: "Billing Support",
    description: "Questions about payments, subscriptions, and billing issues.",
    content: {
      overview: "Get assistance with all billing-related inquiries including subscription management, payment issues, and credit usage questions.",
      sections: [
        {
          title: "Subscription Management",
          content: "Manage your subscription plans, upgrade or downgrade your account, and understand billing cycles."
        },
        {
          title: "Payment Issues",
          content: "Resolve payment failures, update payment methods, and understand our refund policies."
        },
        {
          title: "Credit System",
          content: "Learn how our credit system works, track your usage, and purchase additional credits when needed."
        }
      ],
      faq: [
        {
          question: "How do credits work?",
          answer: "Credits are used for AI-powered features. Each generation consumes credits based on complexity. You can track usage in your dashboard."
        },
        {
          question: "Can I get a refund?",
          answer: "Refunds are available within 30 days of purchase for unused subscriptions. Contact support for assistance."
        }
      ],
      relatedLinks: [
        { title: "Upgrade Credit", url: "/account/upgrade/credit" },
        { title: "Dashboard", url: "/dashboard" }
      ]
    }
  },
  {
    id: "feature-guidance",
    title: "Feature Guidance",
    description: "Learn how to use MARQAIT's powerful features effectively.",
    content: {
      overview: "Discover how to make the most of MARQAIT's AI-powered marketing tools. From logo generation to social media content creation, we'll guide you through every feature.",
      sections: [
        {
          title: "Logo Generator",
          content: "Create professional logos using AI. Input your brand details, choose styles, and generate unlimited variations until you find the perfect design."
        },
        {
          title: "Social Media Posts",
          content: "Generate engaging social media content tailored to different platforms. Customize colors, fonts, and layouts to match your brand."
        },
        {
          title: "Brand Book Creation",
          content: "Develop comprehensive brand guidelines including color palettes, typography, and visual identity standards."
        }
      ],
      faq: [
        {
          question: "How do I create a logo?",
          answer: "Go to Logo Generator, fill in your business details, select preferences, and let our AI create unique designs for you."
        },
        {
          question: "Can I edit generated content?",
          answer: "Yes, all generated content can be customized using our built-in editor tools."
        }
      ],
      relatedLinks: [
        { title: "Logo Generator", url: "/logo-generator" },
        { title: "Social Posts", url: "/social-media-post-generator" }
      ]
    }
  },
  {
    id: "account-management",
    title: "Account Management",
    description: "Manage your profile, security, and account preferences.",
    content: {
      overview: "Learn how to effectively manage your MARQAIT account, including profile updates, security settings, and workspace customization.",
      sections: [
        {
          title: "Profile Settings",
          content: "Update your personal information, business details, and communication preferences to personalize your MARQAIT experience."
        },
        {
          title: "Security & Privacy",
          content: "Manage your password, enable two-factor authentication, and control data sharing preferences for maximum account security."
        },
        {
          title: "Workspace Customization",
          content: "Customize your dashboard layout, set default preferences, and organize your projects for improved workflow efficiency."
        }
      ],
      faq: [
        {
          question: "How do I change my password?",
          answer: "Go to Settings > Security and click 'Change Password'. You'll need to verify your current password first."
        },
        {
          question: "Can I delete my account?",
          answer: "Yes, you can request account deletion from Settings > Account. Note that this action is permanent and cannot be undone."
        }
      ]
    }
  },
  {
    id: "api-integration",
    title: "API Integration",
    description: "Integrate MARQAIT's capabilities into your own applications.",
    content: {
      overview: "Learn how to integrate MARQAIT's AI-powered marketing tools into your own applications using our comprehensive API.",
      sections: [
        {
          title: "Getting Started",
          content: "Obtain your API keys, understand authentication methods, and make your first API call to MARQAIT's services."
        },
        {
          title: "Available Endpoints",
          content: "Explore our logo generation, content creation, and image editing APIs with detailed documentation and examples."
        },
        {
          title: "Best Practices",
          content: "Learn about rate limiting, error handling, and optimization techniques for seamless API integration."
        }
      ],
      faq: [
        {
          question: "How do I get API access?",
          answer: "API access is available for Professional and Enterprise plans. Generate your API keys from the Settings > API section."
        },
        {
          question: "What are the rate limits?",
          answer: "Rate limits vary by plan. Professional plans have higher limits. Check our documentation for specific details."
        }
      ]
    }
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    description: "Common issues and their solutions.",
    content: {
      overview: "Find quick solutions to common problems and learn troubleshooting techniques for a smooth MARQAIT experience.",
      sections: [
        {
          title: "Performance Issues",
          content: "Resolve slow loading times, browser compatibility issues, and optimize your experience for better performance."
        },
        {
          title: "Generation Errors",
          content: "Troubleshoot failed generations, understand error messages, and learn how to resolve common generation issues."
        },
        {
          title: "Browser Compatibility",
          content: "Ensure optimal compatibility across different browsers and resolve browser-specific issues."
        }
      ],
      faq: [
        {
          question: "Why is MARQAIT running slowly?",
          answer: "Check your internet connection, clear browser cache, and ensure you're using a supported browser version."
        },
        {
          question: "My generation failed. What should I do?",
          answer: "Try again with simpler inputs. If the issue persists, check your credit balance and contact support."
        }
      ]
    }
  },
  {
    id: "getting-started",
    title: "Getting Started",
    description: "New to MARQAIT? Start here for a complete overview.",
    content: {
      overview: "Welcome to MARQAIT! This comprehensive guide will help you get started with our AI-powered marketing tools and make the most of your account.",
      sections: [
        {
          title: "Account Setup",
          content: "Complete your profile, verify your email, and set up your workspace preferences to get the most out of MARQAIT."
        },
        {
          title: "First Steps",
          content: "Learn the basics of navigation, understand the credit system, and try your first AI generation."
        },
        {
          title: "Best Practices",
          content: "Discover tips and tricks for creating better prompts, organizing your projects, and maximizing your creative output."
        }
      ],
      faq: [
        {
          question: "What can I create with MARQAIT?",
          answer: "You can create logos, social media posts, brand books, marketing campaigns, and much more using our AI-powered tools."
        },
        {
          question: "Do I need design experience?",
          answer: "No design experience required! Our AI tools are designed to help anyone create professional marketing materials."
        }
      ]
    }
  },
  {
    id: "advanced-features",
    title: "Advanced Features",
    description: "Unlock the full potential of MARQAIT's advanced capabilities.",
    content: {
      overview: "Explore MARQAIT's advanced features designed for power users and marketing professionals who want to maximize their creative output.",
      sections: [
        {
          title: "Batch Processing",
          content: "Learn how to create multiple variations, batch process content, and manage large-scale marketing campaigns efficiently."
        },
        {
          title: "Custom Templates",
          content: "Create and save custom templates for consistent branding across all your marketing materials."
        },
        {
          title: "Workflow Automation",
          content: "Set up automated workflows to streamline your content creation process and maintain brand consistency."
        }
      ],
      faq: [
        {
          question: "How do I create custom templates?",
          answer: "Navigate to Templates in your dashboard, click 'Create New', and customize according to your brand guidelines."
        },
        {
          question: "Can I automate content creation?",
          answer: "Yes, Professional and Enterprise plans include workflow automation features for scheduled content generation."
        }
      ]
    }
  },
  {
    id: "community-resources",
    title: "Community Resources",
    description: "Connect with other MARQAIT users and access community content.",
    content: {
      overview: "Join the MARQAIT community to share ideas, get inspiration, and learn from other creative professionals using our platform.",
      sections: [
        {
          title: "Community Forum",
          content: "Participate in discussions, share your creations, and get feedback from other MARQAIT users."
        },
        {
          title: "Resource Library",
          content: "Access free templates, design inspiration, and marketing resources created by the community."
        },
        {
          title: "User Showcases",
          content: "Get inspired by amazing creations from our user community and learn new techniques."
        }
      ],
      faq: [
        {
          question: "How do I join the community?",
          answer: "All MARQAIT users automatically have access to our community forum. Log in with your account credentials."
        },
        {
          question: "Can I share my creations?",
          answer: "Yes! We encourage users to share their work and inspire others. Use our showcase feature in the community section."
        }
      ]
    }
  }
];

export const getSupportCardById = (id: string): SupportCard | undefined => {
  return supportCards.find(card => card.id === id);
};